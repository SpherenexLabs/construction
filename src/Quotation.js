import React, { useEffect, useMemo, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import History from "./History";
import { uploadPDFToStorage } from "./firebase";
import "./Quotation.css";

const fmt = (n) =>
  (isNaN(n) ? 0 : Number(n)).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const rAF = () => new Promise(requestAnimationFrame);

// Simplified approach to replace form inputs with text
function replaceInputsWithText(element) {
  const inputs = element.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const span = document.createElement('span');
    span.style.cssText = `
      display: inline-block;
      width: 100%;
      padding: ${getComputedStyle(input).padding};
      font-size: ${getComputedStyle(input).fontSize};
      font-family: Arial, sans-serif;
      color: #000;
      text-align: ${getComputedStyle(input).textAlign || 'left'};
      line-height: 1.2;
      vertical-align: middle;
      min-height: 16px;
      box-sizing: border-box;
    `;
    
    let text = '';
    if (input.tagName === 'SELECT') {
      const selected = input.selectedOptions[0];
      text = selected ? selected.text : input.value;
    } else {
      text = input.value;
    }
    
    span.textContent = text || ' '; // Space for empty values
    input.parentNode.replaceChild(span, input);
  });
}

// Indian number to words
function numberToWords(num) {
  if (num === 0) return "Zero";
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  
  function convertHundreds(n) {
    let r = "";
    if (n >= 100) { r += ones[Math.floor(n / 100)] + " Hundred "; n %= 100; }
    if (n >= 20) { r += tens[Math.floor(n / 10)] + " "; n %= 10; }
    if (n > 0) { r += ones[n] + " "; }
    return r;
  }
  
  const crore = Math.floor(num / 10000000); num %= 10000000;
  const lakh = Math.floor(num / 100000);    num %= 100000;
  const thousand = Math.floor(num / 1000);  num %= 1000;
  const hundred = num;
  
  let out = "";
  if (crore)   out += convertHundreds(crore) + "Crore ";
  if (lakh)    out += convertHundreds(lakh) + "Lakh ";
  if (thousand)out += convertHundreds(thousand) + "Thousand ";
  if (hundred) out += convertHundreds(hundred);
  
  return out.trim() + " Only";
}

export default function TaxQuotation() {
  const sheetRef = useRef(null);
  const [preview, setPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [categoryModal, setCategoryModal] = useState({ show: false, itemId: null, text: '', field: 'category' });
  
  useEffect(() => {
    console.log('[Quotation] mounted');
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDownloadMenu && !event.target.closest('.download-dropdown-wrapper')) {
        setShowDownloadMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDownloadMenu]);

  // Company
  const [company, setCompany] = useState({
    name: "VRM GROUPS",
    phone: "+91 9900315454",
    email: "info@vrmgroups.com",
    website: "www.vrmgroups.com",
    address1: "15th Cross, A Block No.27",
    address2: "Ground Floor, Bhuvaneshwari Nagar",
    address3: "Magadi Main Road, Bangalore - 560091",
    gstin: "29ATHPV3440K1Z5",
  });

  // Invoice
  const [invoice, setInvoice] = useState({
    number: "QTN-" + new Date().getTime().toString().slice(-6),
    date: new Date().toISOString().slice(0, 10),
  });

  // Bill to
  const [billTo, setBillTo] = useState({
    name: "", address: "", contactNo: "", gstin: "", state: ""
  });

  // Site location
  const [siteLocation, setSiteLocation] = useState({
    name: "", address: "", contactNo: ""
  });

  // Combined items list (materials, subjects, and page breaks)
  const [items, setItems] = useState([]);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  
  useEffect(() => {
    try {
      // Check if loading from history (triggered from Categories page)
      const loadFromHistoryRaw = localStorage.getItem("loadFromHistory");
      if (loadFromHistoryRaw) {
        const historyItem = JSON.parse(loadFromHistoryRaw);
        localStorage.removeItem("loadFromHistory"); // Clear after loading
        
        // Load all the data from history item
        if (historyItem.billTo) setBillTo(historyItem.billTo);
        if (historyItem.siteLocation) setSiteLocation(historyItem.siteLocation);
        if (historyItem.company) setCompany(historyItem.company);
        if (historyItem.items && historyItem.items.length > 0) {
          setItems(historyItem.items);
        } else {
          setItems([{ id: 1, type: 'material', category: "", subcategory: "", hsn: "", qty: 0, unit: "Nos", pricePerUnit: 0, discount: 0, gst: 18 }]);
        }
        if (historyItem.taxRates) setTaxRates(historyItem.taxRates);
        if (historyItem.discountPercent !== undefined) setDiscountPercent(historyItem.discountPercent);
        
        // Generate new quotation number to avoid conflicts
        const newInvoiceNumber = "QTN-" + new Date().getTime().toString().slice(-6);
        setInvoice({
          ...historyItem.invoice,
          number: newInvoiceNumber,
          date: new Date().toISOString().slice(0, 10)
        });
        
        setInitialLoadDone(true);
        return;
      }
      
      // Try to load full items first (includes subjects and page breaks)
      const fullItemsRaw = localStorage.getItem("quotationFullItems");
      const quotationItemsRaw = localStorage.getItem("quotationItems");
      
      if (fullItemsRaw) {
        const fullItems = JSON.parse(fullItemsRaw);
        if (Array.isArray(fullItems) && fullItems.length > 0) {
          // Check if quotationItems has changed (user selected more/different materials)
          if (quotationItemsRaw) {
            const quotationItems = JSON.parse(quotationItemsRaw);
            const existingMaterials = fullItems.filter(item => item.type === 'material');
            
            // Filter quotation materials that match the quotationItems
            const quotationItemNames = quotationItems.map(it => it.label || it.name || "");
            const quotationMaterials = existingMaterials.filter(mat => 
              mat.category && quotationItemNames.includes(mat.category)
            );
            
            const existingMaterialNames = quotationMaterials.map(m => m.category);
            const newMaterialNames = quotationItems.map(it => it.label || it.name || "");
            
            // Check if materials have changed
            const materialsChanged = JSON.stringify(existingMaterialNames.sort()) !== JSON.stringify(newMaterialNames.sort());
            
            if (materialsChanged) {
              // Map existing materials by category name for preservation
              const existingMap = new Map();
              quotationMaterials.forEach(mat => {
                existingMap.set(mat.category, mat);
              });
              
              // Process materials from quotationItems
              const updatedMaterials = quotationItems.map((it) => {
                const categoryName = it.label || it.name || "";
                // If material exists, preserve its data (qty, price, etc.)
                if (existingMap.has(categoryName)) {
                  return existingMap.get(categoryName);
                }
                // New material
                return {
                  id: Date.now() + Math.random(),
                  type: 'material',
                  category: categoryName,
                  subcategory: "",
                  hsn: "", 
                  qty: 1, 
                  unit: "Nos", 
                  pricePerUnit: 0, 
                  discount: 0, 
                  gst: 18
                };
              });
              
              // Reconstruct: keep all items including manually added materials
              const finalItems = [];
              
              // Add all items in their original order, replacing quotation materials with updated ones
              fullItems.forEach(item => {
                if (item.type !== 'material') {
                  // Keep subjects and page breaks
                  finalItems.push(item);
                } else if (!item.category || !quotationItemNames.includes(item.category)) {
                  // Keep manually added materials
                  finalItems.push(item);
                } else {
                  // Replace with updated material from quotationItems
                  const updatedMat = updatedMaterials.find(m => m.category === item.category);
                  if (updatedMat) {
                    finalItems.push(updatedMat);
                    // Mark as added so we don't add it again
                    updatedMat._added = true;
                  }
                }
              });
              
              // Add any new materials from quotationItems that weren't in the original list
              updatedMaterials.forEach(mat => {
                if (!mat._added) {
                  finalItems.push(mat);
                }
              });
              
              setItems(finalItems);
            } else {
              // No change, use stored full items
              setItems(fullItems);
            }
          } else {
            setItems(fullItems);
          }
          setInitialLoadDone(true);
          return;
        }
      }
      
      // Fallback: load from quotationItems only (first time)
      const raw = localStorage.getItem("quotationItems");
      if (raw) {
        const arr = JSON.parse(raw);
        const rows = arr.map((it, i) => ({
          id: i + 1,
          type: 'material',
          category: it.label || it.name || "",
          subcategory: "",
          hsn: "", 
          qty: 1, 
          unit: "Nos", 
          pricePerUnit: 0, 
          discount: 0, 
          gst: 18
        }));
        setItems(rows.length ? rows : [{ id: 1, type: 'material', category: "", subcategory: "", hsn: "", qty: 0, unit: "Nos", pricePerUnit: 0, discount: 0, gst: 18 }]);
      } else {
        setItems([{ id: 1, type: 'material', category: "", subcategory: "", hsn: "", qty: 0, unit: "Nos", pricePerUnit: 0, discount: 0, gst: 18 }]);
      }
      setInitialLoadDone(true);
    } catch {
      setItems([{ id: 1, type: 'material', category: "", subcategory: "", hsn: "", qty: 0, unit: "Nos", pricePerUnit: 0, discount: 0, gst: 18 }]);
      setInitialLoadDone(true);
    }
  }, []);

  // Save full items (including subjects and page breaks) whenever items change
  useEffect(() => {
    if (initialLoadDone && items.length > 0) {
      localStorage.setItem("quotationFullItems", JSON.stringify(items));
    }
  }, [items, initialLoadDone]);

  // Tax rates editable (manual input). Start at 0 so GST applies only if user enters a value
  const [taxRates, setTaxRates] = useState({ sgst: 0, cgst: 0 });
  const [discountPercent, setDiscountPercent] = useState(0);
  const [manualSubtotal, setManualSubtotal] = useState(null); // null means use calculated value

  const addMaterial = () => {
    const newId = Date.now() + Math.random(); // Ensure unique ID
    setItems((m) => [...m, { id: newId, type: 'material', category: "", subcategory: "", hsn: "", qty: 0, unit: "Nos", pricePerUnit: 0, discount: 0, gst: 18 }]);
  };

  const addSubject = () => {
    const newId = Date.now() + Math.random(); // Ensure unique ID
    setItems((m) => [...m, { id: newId, type: 'subject', content: '' }]);
  };

  const addPageBreak = () => {
    const newId = Date.now() + Math.random(); // Ensure unique ID
    setItems((m) => [...m, { id: newId, type: 'pagebreak' }]);
  };

  // Create new blank quotation
  const createNewQuotation = async () => {
    if (window.confirm('Are you sure you want to create a new quotation? Current data will be saved to history.')) {
      // Check if there's data worth saving (at least one material with category or billTo name)
      const hasMeaningfulData = items.some(item => item.type === 'material' && item.category) || billTo.name;
      
      if (hasMeaningfulData) {
        try {
          // Save current quotation to history before clearing
          const historyItem = {
            id: Date.now().toString(),
            type: 'quotation',
            documentTitle: 'Quotation (Auto-saved)',
            quotationNumber: invoice.number || 'Unknown',
            customerName: billTo.name || 'Unknown Customer',
            siteLocationName: siteLocation.name || '',
            totalAmount: calculations.grandTotal || 0,
            createdAt: new Date().toISOString(),
            items: items || [],
            billTo: billTo,
            siteLocation: siteLocation,
            company: company,
            invoice: invoice,
            taxRates: taxRates,
            discountPercent: discountPercent,
            autoSaved: true
          };

          const existingHistory = localStorage.getItem('quotationHistory');
          const history = existingHistory ? JSON.parse(existingHistory) : [];
          history.unshift(historyItem);
          
          if (history.length > 50) {
            history.splice(50);
          }
          
          localStorage.setItem('quotationHistory', JSON.stringify(history));
          console.log('✅ Current quotation auto-saved to history');
        } catch (error) {
          console.error('Error saving to history:', error);
        }
      }
      
      // Clear localStorage
      localStorage.removeItem('quotationFullItems');
      localStorage.removeItem('quotationItems');
      
      // Reset all state to initial values
      setBillTo({ name: "", address: "", contactNo: "", gstin: "", state: "" });
      setSiteLocation({ name: "", address: "", contactNo: "" });
      setItems([{ id: 1, type: 'material', category: "", subcategory: "", hsn: "", qty: 0, unit: "Nos", pricePerUnit: 0, discount: 0, gst: 18 }]);
      setInvoice({
        number: "QTN-" + new Date().getTime().toString().slice(-6),
        date: new Date().toISOString().slice(0, 10),
      });
      setTaxRates({ sgst: 0, cgst: 0 });
      setDiscountPercent(0);
      setManualSubtotal(null);
      
      alert('New quotation created! Previous data saved to history.');
    }
  };

  const removeItem = (id) => {
    setItems((m) => {
      if (m.length <= 1) return m;
      
      const itemToRemove = m.find(x => x.id === id);
      const filtered = m.filter((x) => x.id !== id);
      
      // If removing a material, also remove from quotationItems in localStorage
      if (itemToRemove && itemToRemove.type === 'material') {
        try {
          const quotationItemsRaw = localStorage.getItem("quotationItems");
          if (quotationItemsRaw) {
            const quotationItems = JSON.parse(quotationItemsRaw);
            const updatedQuotationItems = quotationItems.filter(item => {
              const itemName = item.label || item.name || "";
              return itemName !== itemToRemove.category;
            });
            localStorage.setItem("quotationItems", JSON.stringify(updatedQuotationItems));
          }
        } catch (error) {
          console.error("Error updating quotationItems:", error);
        }
      }
      
      return filtered;
    });
  };

  const addPageBreakAfter = (afterId) => {
    const newId = Date.now() + Math.random();
    setItems((m) => {
      const index = m.findIndex(item => item.id === afterId);
      if (index === -1) return m;
      const newItems = [...m];
      newItems.splice(index + 1, 0, { id: newId, type: 'pagebreak' });
      return newItems;
    });
  };

  const updateMaterial = (id, field, value) =>
    setItems((m) =>
      m.map((row) =>
        row.id === id && row.type === 'material'
          ? { ...row, [field]: ["category", "subcategory", "hsn", "unit"].includes(field) ? value : Number(value || 0) }
          : row
      )
    );

  const updateSubject = (id, content) =>
    setItems((m) => m.map((item) => item.id === id && item.type === 'subject' ? { ...item, content } : item));

  const calculations = useMemo(() => {
    let subtotal = 0;
    // Only calculate materials, not subjects or page breaks
    items.filter(item => item.type === 'material').forEach((m) => {
      const amt = m.qty * m.pricePerUnit;
      subtotal += (amt - (amt * m.discount) / 100);
    });
    const overallDiscount = (subtotal * discountPercent) / 100;
    const calculatedSubtotal = subtotal - overallDiscount;
    
    // Use manual subtotal if provided, otherwise use calculated
    const finalSubtotal = manualSubtotal !== null ? manualSubtotal : calculatedSubtotal;
    
    const sgst = (finalSubtotal * taxRates.sgst) / 100;
    const cgst = (finalSubtotal * taxRates.cgst) / 100;
    const grandTotal = finalSubtotal + sgst + cgst;
    return { subtotal: finalSubtotal, discount: overallDiscount, sgst, cgst, grandTotal };
  }, [items, discountPercent, taxRates.sgst, taxRates.cgst, manualSubtotal]);

  // Logo
  const LOGO_PRIMARY = (process.env.PUBLIC_URL || "") + "/assets/vrmlogo.png";
  const LOGO_FALLBACK = (process.env.PUBLIC_URL || "") + "/assests/vrmlogo.png";
  const [logoSrc, setLogoSrc] = useState(LOGO_PRIMARY);

  // History functionality with Firebase Storage
  const saveToHistory = async (type, pdfBlob = null, customTitle = null, displayFilename = null) => {
    try {
      console.log('💾 Saving to Firebase Storage:', type, 'PDF size:', pdfBlob ? pdfBlob.size : 'No PDF');
      
      if (!pdfBlob) {
        console.log('⚠️ No PDF blob provided, skipping upload');
        return null;
      }

      const timestamp = Date.now();
      const filename = displayFilename || `${type}_${invoice.number || 'Unknown'}_${timestamp}.pdf`;
      const documentType = customTitle || type;
      
      const metadata = {
        type: type, // 'quotation' or 'invoice'
        documentTitle: documentType, // Display title like 'Tax Quotation' or 'Invoice Quotation'
        quotationNumber: invoice.number || 'Unknown',
        customerName: billTo.name || 'Unknown Customer',
        siteLocationName: siteLocation.name || '',
        totalAmount: calculations.grandTotal || 0,
        items: items || [],
        billTo: billTo,
        siteLocation: siteLocation,
        company: company,
        invoice: invoice,
        taxRates: taxRates,
        discountPercent: discountPercent,
        status: 'active'
      };

      // Upload PDF to Firebase Storage and save metadata to Firestore
      console.log('🚀 Uploading to Firebase...');
      const result = await uploadPDFToStorage(pdfBlob, filename, metadata);
      console.log(`✅ ${type} saved to Firebase successfully:`, result.id);
      return result;
      
    } catch (error) {
      console.error('❌ Error saving to Firebase:', error);
      alert(`⚠️ Firebase upload failed: ${error.message}\n\nSaving to localStorage as fallback...`);
      
      // Fallback to localStorage for offline functionality
      try {
        console.log('💾 Falling back to localStorage...');
        const historyItem = {
          id: Date.now().toString(),
          type: type,
          documentTitle: customTitle || type,
          quotationNumber: invoice.number || 'Unknown',
          customerName: billTo.name || 'Unknown Customer',
          siteLocationName: siteLocation.name || '',
          totalAmount: calculations.grandTotal || 0,
          createdAt: new Date().toISOString(),
          items: items || [],
          billTo: billTo,
          siteLocation: siteLocation,
          company: company,
          invoice: invoice,
          taxRates: taxRates,
          discountPercent: discountPercent,
          pdfInfo: pdfBlob ? {
            size: pdfBlob.size,
            type: pdfBlob.type,
            generated: true,
            offline: true
          } : null
        };

        const existingHistory = localStorage.getItem('quotationHistory');
        const history = existingHistory ? JSON.parse(existingHistory) : [];
        history.unshift(historyItem);
        
        if (history.length > 50) {
          history.splice(50);
        }
        
        localStorage.setItem('quotationHistory', JSON.stringify(history));
        console.log('✅ Saved to localStorage as fallback');
        return { id: historyItem.id, offline: true };
      } catch (fallbackError) {
        console.error('❌ Failed to save even to localStorage:', fallbackError);
        alert('❌ Failed to save quotation history!');
        throw fallbackError;
      }
    }
  };

  const loadFromHistory = (historyItem) => {
    // Load all the data from history item
    setBillTo(historyItem.billTo);
    setSiteLocation(historyItem.siteLocation);
    setCompany(historyItem.company);
    setItems(historyItem.items || []);
    setTaxRates(historyItem.taxRates);
    setDiscountPercent(historyItem.discountPercent);
    
    // Generate new quotation number to avoid conflicts
    const newInvoiceNumber = "QTN-" + new Date().getTime().toString().slice(-6);
    setInvoice({
      ...historyItem.invoice,
      number: newInvoiceNumber,
      date: new Date().toISOString().slice(0, 10) // Update to current date
    });
    
    // Exit history view
    setShowHistory(false);
  };

  // Download Tax Quotation
  const downloadTaxQuotation = async () => {
    if (isGenerating) return;
    setShowDownloadMenu(false);
    setIsGenerating(true);
    
    try {
      await downloadPDF('quotation', true, 'Quotation');
    } catch (error) {
      console.error('Error downloading Tax Quotation:', error);
      alert('Error downloading Tax Quotation. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Download Tax Invoice
  const downloadInvoiceQuotation = async () => {
    if (isGenerating) return;
    setShowDownloadMenu(false);
    setIsGenerating(true);
    
    try {
      await downloadPDF('invoice', true, 'Tax Invoice');
    } catch (error) {
      console.error('Error downloading Tax Invoice:', error);
      alert('Error downloading Tax Invoice. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Multi-page PDF generation
  // variant: 'quotation' | 'invoice'
  // customTitle: optional custom title for the PDF
  const downloadPDF = async (variant = 'quotation', skipLoadingState = false, customTitle = null) => {
    if (isGenerating && !skipLoadingState) return;
    if (!skipLoadingState) setIsGenerating(true);

    try {
      const sourceElement = sheetRef.current;
      if (!sourceElement) {
        throw new Error("Source element not found");
      }

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = pageHeight - (margin * 2);

      // A4 dimensions: 210mm x 297mm
      // Calculate items per page with accurate measurements
      const headerHeight = 120; // Header + bill-to section (including company info, logo, customer details)
      const footerHeight = 220; // Totals + bank details + terms & conditions + signature (must fit all on last page)
      const rowHeight = 13;     // Height per material row (accounting for subcategory inputs - 50px CSS min-height)
      const availableHeightFirstPages = contentHeight - headerHeight - 30; // First/middle pages: just small margin at bottom
      const availableHeightLastPage = contentHeight - headerHeight - footerHeight; // Last page: reserve space for full footer
      const maxItemsPerPage = Math.max(1, Math.floor(availableHeightFirstPages / rowHeight)); // Items on first/middle pages
      const maxItemsLastPage = Math.max(1, Math.floor(availableHeightLastPage / rowHeight)); // Items that can fit with footer
      
      console.log('PDF Pagination Info:', {
        pageHeight: pageHeight + 'mm',
        contentHeight: contentHeight + 'mm', 
        availableHeightFirstPages: availableHeightFirstPages + 'mm',
        availableHeightLastPage: availableHeightLastPage + 'mm',
        maxItemsPerPage,
        maxItemsLastPage,
        totalMaterials: items.filter(item => item.type === 'material').length
      });

      // Split items into chunks respecting page breaks
      const materialChunks = [];
      let currentChunk = [];
      
      items.forEach(item => {
        if (item.type === 'pagebreak') {
          // Save current chunk and start new page
          if (currentChunk.length > 0) {
            materialChunks.push(currentChunk);
            currentChunk = [];
          } else {
            // If no content before page break, still create a page
            materialChunks.push([]);
          }
        } else if (item.type === 'material' || item.type === 'subject') {
          // Add all items to current chunk - manual page breaks control pagination
          currentChunk.push(item);
        }
      });
      
      // Add remaining items
      if (currentChunk.length > 0) {
        materialChunks.push(currentChunk);
      }

      // If no materials at all, create at least one chunk
      if (materialChunks.length === 0) {
        materialChunks.push([]);
      }

      // CRITICAL FIX: Always ensure there's a final page for footer content
      // Check if last chunk has too many items to fit footer properly
      if (materialChunks.length > 0) {
        const lastChunk = materialChunks[materialChunks.length - 1];
        const materialCount = lastChunk.filter(item => item.type === 'material' || item.type === 'subject').length;
        
        // If last page would have more items than can fit with footer, create empty final page
        if (materialCount > maxItemsLastPage) {
          materialChunks.push([]); // Add empty final page for footer only
          console.log('Added empty final page for footer - last chunk had', materialCount, 'items, max with footer is', maxItemsLastPage);
        }
      }

      // Generate each page
      for (let pageIndex = 0; pageIndex < materialChunks.length; pageIndex++) {
        const isFirstPage = pageIndex === 0;
        const isLastPage = pageIndex === materialChunks.length - 1;
        const currentChunk = materialChunks[pageIndex];

        // Create page content
        const pageElement = await createPageElement(
          sourceElement, 
          currentChunk, 
          pageIndex + 1, 
          materialChunks.length,
          isFirstPage, 
          isLastPage,
          variant,
          customTitle
        );

        // Create wrapper for the page with A4 constraints
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
          position: absolute;
          top: -9999px;
          left: 0;
          width: 794px;
          max-height: 1123px;
          background: white;
          font-family: Arial, sans-serif;
          overflow: hidden;
          box-sizing: border-box;
        `;
        
        document.body.appendChild(wrapper);
        wrapper.appendChild(pageElement);

        // Wait for fonts and layout
        await rAF();
        await rAF();

        // Replace inputs with text
        replaceInputsWithText(pageElement);

        // Wait for changes to take effect
        await rAF();
        await rAF();
        
        // Log actual dimensions for debugging
        console.log(`Page ${pageIndex + 1} dimensions:`, {
          width: pageElement.offsetWidth + 'px',
          height: pageElement.offsetHeight + 'px',
          itemsOnPage: currentChunk.length
        });

        // Wait for fonts to load before rendering
        await document.fonts.ready;
        await new Promise(resolve => setTimeout(resolve, 100));

        // Generate canvas optimized for A4 dimensions
        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          foreignObjectRendering: false,
          allowTaint: false,
          imageTimeout: 0,
          removeContainer: true,
          width: 794,
          height: Math.min(pageElement.offsetHeight, 1123)
        });

        // Clean up
        document.body.removeChild(wrapper);

        // Add page to PDF
        if (pageIndex > 0) {
          pdf.addPage();
        }

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        
        // Calculate dimensions to properly fit A4 page
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        // Convert pixels to mm (1 pixel = 0.264583 mm at 96 DPI)
        const imgWidthMM = imgWidth * 0.264583;
        const imgHeightMM = imgHeight * 0.264583;
        
        // Ensure content fits within A4 boundaries
        const scaleX = contentWidth / imgWidthMM;
        const scaleY = contentHeight / imgHeightMM;
        const scale = Math.min(scaleX, scaleY, 1); // Never scale up, only down
        
        const finalWidth = imgWidthMM * scale;
        const finalHeight = imgHeightMM * scale;

        const x = margin;
        const y = margin;

        pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);
      }

  // Determine titles & filename based on variant and customTitle
  const isInvoice = variant === 'invoice';
  const filenameBase = customTitle ? customTitle.replace(/ /g, '-') : (isInvoice ? 'Tax-Invoice' : 'Tax-Quotation');
  const customerName = billTo.name ? billTo.name.replace(/[^a-zA-Z0-9]/g, '-') : '';
  const filename = customerName 
    ? `${filenameBase}-${customerName}-${invoice.number || new Date().toISOString().split('T')[0]}.pdf`
    : `${filenameBase}-${invoice.number || new Date().toISOString().split('T')[0]}.pdf`;
  
  // Save PDF and also save to history
  pdf.save(filename);
  
  // Convert PDF to blob for history storage
  const pdfBlob = pdf.output('blob');
  await saveToHistory(variant, pdfBlob, customTitle, filename);

    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert(`Failed to generate PDF: ${error.message}`);
    } finally {
      if (!skipLoadingState) setIsGenerating(false);
    }
  };

  // Helper function to create page element
  const createPageElement = async (sourceElement, materialsForPage, pageNum, totalPages, isFirstPage, isLastPage, variant, customTitle = null) => {
    const clone = sourceElement.cloneNode(true);
    const isInvoice = variant === 'invoice';
    const mainHeadingWord = customTitle || (isInvoice ? 'INVOICE' : 'QUOTATION');
    const barTitle = customTitle || (isInvoice ? 'Tax Invoice' : 'Quotation');
    
    // Add font import and styling for PDF rendering
    const fontStyle = document.createElement('style');
    fontStyle.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Quantico:wght@400;700&display=swap');
      .brand-vrm, .brand-groups { 
        font-family: 'Quantico', Impact, 'Arial Black', sans-serif !important; 
      }
    `;
    clone.appendChild(fontStyle);
    
    // Style the clone with A4 page constraints
    clone.style.cssText = `
      width: 794px;
      max-height: 1123px;
      transform: none;
      font-family: Arial, sans-serif;
      background: white;
      overflow: hidden;
      box-sizing: border-box;
      padding: 8px;
    `;
    
    // Add PDF mode class for better styling
    clone.classList.add('pdf-mode');

    // Remove elements that shouldn't appear in PDF
    const elementsToHide = clone.querySelectorAll('.col-action, .remove-btn, .add-material-section, .no-print');
    elementsToHide.forEach(el => el.style.display = 'none');

    // Force Quantico font on VRM GROUPS elements
    const vrmElements = clone.querySelectorAll('.brand-vrm, .brand-groups');
    vrmElements.forEach(el => {
      el.style.fontFamily = 'Quantico, Impact, Arial Black, sans-serif';
    });

    // Update table headers to remove action column
    const tableHeaders = clone.querySelectorAll('.table-header');
    tableHeaders.forEach(header => {
      header.style.gridTemplateColumns = '35px 200px 65px 50px 55px 85px 50px 60px 85px';
    });

    // Handle materials table
    const materialsTable = clone.querySelector('.materials-table');
    if (materialsTable) {
      // Check if this page has any materials to show
      const hasMaterialsOnPage = materialsForPage.some(item => item.type === 'material' || item.type === 'subject');
      
      // If last page with no materials, hide the entire table (header included)
      if (isLastPage && !hasMaterialsOnPage) {
        materialsTable.style.display = 'none';
      } else {
        // Remove ALL existing content except header (including subjects, materials, page breaks)
        const children = Array.from(materialsTable.children);
        children.forEach(child => {
          if (!child.classList.contains('table-header')) {
            child.remove();
          }
        });

        // Add rows for this page
        const allMaterials = items.filter(item => item.type === 'material');
        materialsForPage.forEach((item, index) => {
          if (item.type === 'subject') {
            // Render subject with formatting
            const renderFormattedContent = (text) => {
              if (!text) return '';
              let formatted = text;
              // Bold: **text**
              formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
              // Italic: *text*
              formatted = formatted.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
              // Underline: __text__
              formatted = formatted.replace(/__(.*?)__/g, '<u>$1</u>');
              return formatted;
            };
            
            const subjectRow = document.createElement('div');
            subjectRow.style.cssText = 'padding: 10px; background: #06e2ba; border-bottom: 1px solid #ddd; margin-bottom: 5px;';
            subjectRow.innerHTML = `
              <strong style="color: #000000; margin-bottom: 5px; display: block;">Subject/Note:</strong>
              <div style="font-family: Arial; font-size: 18px; line-height: 1.5; white-space: pre-wrap;">${renderFormattedContent(item.content || '')}</div>
            `;
            materialsTable.appendChild(subjectRow);
          } else if (item.type === 'material') {
            // Render material
            const globalIndex = allMaterials.findIndex(m => m.id === item.id);
            const row = document.createElement('div');
            row.className = 'table-row';
            row.style.gridTemplateColumns = '35px 200px 65px 50px 55px 85px 50px 60px 85px';
            
            // Build category display with proper formatting
            let categoryHTML = '';
            if (item.category && item.subcategory) {
              categoryHTML = `
                <div style="display: flex; flex-direction: column; gap: 2px; width: 100%;">
                  <span style="font-family: 'Times New Roman', serif; font-size: 16px; font-weight: 800; color: #000000; white-space: normal; word-wrap: break-word; overflow-wrap: break-word;">${item.category}</span>
                  <span style="font-family: Arial, sans-serif; font-size: 14px; color: #000000; white-space: normal; word-wrap: break-word; overflow-wrap: break-word;">${item.subcategory}</span>
                </div>
              `;
            } else if (item.category) {
              categoryHTML = `<span style="font-family: 'Times New Roman', serif; font-size: 16px; font-weight: 800; color: #000000; white-space: normal; word-wrap: break-word; overflow-wrap: break-word;">${item.category}</span>`;
            } else if (item.subcategory) {
              categoryHTML = `<span style="font-family: Arial, sans-serif; font-size: 14px; color: #000000; white-space: normal; word-wrap: break-word; overflow-wrap: break-word;">${item.subcategory}</span>`;
            }
            
            row.innerHTML = `
              <div class="col-num">${globalIndex + 1}</div>
              <div class="col-category">${categoryHTML}</div>
              <div class="col-hsn"><span>${item.hsn}</span></div>
              <div class="col-qty"><span>${item.qty}</span></div>
              <div class="col-unit"><span>${item.unit}</span></div>
              <div class="col-price"><span>${item.pricePerUnit}</span></div>
              <div class="col-disc"><span>${item.discount}%</span></div>
              <div class="col-gst"><span>${item.gst}%</span></div>
              <div class="col-amount">₹${fmt(item.qty * item.pricePerUnit * (1 - item.discount/100))}</div>
            `;
            
            materialsTable.appendChild(row);
          }
        });

        // Add total row only on last page (if there are materials on page)
        if (isLastPage && hasMaterialsOnPage) {
          const totalRow = document.createElement('div');
          totalRow.className = 'table-total-row';
          totalRow.style.gridTemplateColumns = '35px 200px 65px 50px 55px 85px 50px 60px 85px';
          totalRow.innerHTML = `
            <div class="col-category total-label">Total</div>
            <div class="col-amount">₹${fmt(calculations.subtotal + calculations.discount)}</div>
          `;
          materialsTable.appendChild(totalRow);
        } else if (!isLastPage) {
          // Remove any existing total row on non-last pages
          const existingTotalRow = clone.querySelector('.table-total-row');
          if (existingTotalRow) existingTotalRow.remove();
        }
      }
    }

    // Always set heading strong for variant
    const headingStrong = clone.querySelector('.construction-heading strong');
    if (headingStrong) headingStrong.textContent = mainHeadingWord;

    // Set invoice (tax) title bar text (same on all pages, no page numbering)
    const invoiceTitle = clone.querySelector('.invoice-title');
    if (invoiceTitle) {
      invoiceTitle.textContent = barTitle;
    }

    // Hide bill-to section on non-first pages
    if (!isFirstPage) {
      const billSiteSection = clone.querySelector('.bill-site-section');
      if (billSiteSection) billSiteSection.style.display = 'none';
    }

    // Hide bottom section on non-last pages - REMOVE from DOM completely
    if (!isLastPage) {
      const bottomSection = clone.querySelector('.bottom-section');
      if (bottomSection) {
        bottomSection.remove(); // Remove completely, not just hide
      }
      const termsSection = clone.querySelector('.terms-conditions');
      if (termsSection) {
        termsSection.remove(); // Remove completely, not just hide
      }
    } else {
      // Ensure bottom and terms sections are visible on last page
      const bottomSection = clone.querySelector('.bottom-section');
      if (bottomSection) {
        bottomSection.style.display = 'grid';
        bottomSection.style.pageBreakInside = 'avoid';
        bottomSection.style.breakInside = 'avoid';
      }
      const termsSection = clone.querySelector('.terms-conditions');
      if (termsSection) {
        termsSection.style.display = 'block';
        termsSection.style.pageBreakInside = 'avoid';
        termsSection.style.breakInside = 'avoid';
      }
    }

    return clone;
  };

  const printInvoice = async () => {
    const src = sheetRef.current;
    if (!src) return;
    src.classList.add("print-mode");
    await rAF();
    window.print();
    setTimeout(() => src.classList.remove("print-mode"), 300);
  };

  return (
    <div className="quotation-container">
      {showHistory ? (
        <History 
          onLoadQuotation={loadFromHistory}
          onBack={() => setShowHistory(false)}
        />
      ) : (
        <>
          <div className="toolbar no-print">
            <button className="btn ghost" onClick={() => window.history.back()}>
              ← Back
            </button>
            <button className="btn ghost" onClick={createNewQuotation}>
              ➕ New Quotation
            </button>
            <button className="btn ghost" onClick={() => setPreview(!preview)}>
              {preview ? "Exit Preview" : "Preview"}
            </button>
            <button className="btn ghost" onClick={() => setShowHistory(true)}>
              📋 History
            </button>
            <div className="spacer" />
            <div className="download-dropdown-wrapper">
              <button 
                className="btn ghost" 
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "📥 Download PDFs"}
              </button>
              {showDownloadMenu && (
                <div className="download-dropdown-menu">
                  <button 
                    className="dropdown-item" 
                    onClick={downloadTaxQuotation}
                    disabled={isGenerating}
                  >
                    📄 Generate Tax Quotation
                  </button>
                  <button 
                    className="dropdown-item" 
                    onClick={downloadInvoiceQuotation}
                    disabled={isGenerating}
                  >
                    📋 Generate Tax Invoice
                  </button>
                </div>
              )}
            </div>
            <button className="btn primary" onClick={printInvoice}>Print</button>
          </div>

      <div className={`invoice-sheet ${preview ? "preview" : ""}`} ref={sheetRef}>
        {/* ===== HEADER ===== */}
        <header className="modern-header header-grid-3">
          {/* Left: title + contact with icons */}
          <div className="header-left">
            <div className="construction-heading">
              <span>Construction</span><br/><strong>QUOTATION</strong>
            </div>

            <div className="contact-line">
              <span className="ic">
                <svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011.1-.2c1.2.5 2.5.8 3.9.8a1 1 0 011 1V21a1 1 0 01-1 1C11.4 22 2 12.6 2 1a1 1 0 011-1h3.8a1 1 0 011 1c0 1.4.3 2.7.8 3.9a1 1 0 01-.2 1.1L6.6 10.8z"/></svg>
              </span>
              <input value={company.phone} onChange={(e)=>setCompany({...company, phone:e.target.value})} readOnly={preview}/>
            </div>
            <div className="contact-line">
              <span className="ic">
                <svg viewBox="0 0 24 24"><path d="M2 6l10 7L22 6v12H2z"/><path d="M2 6l10 7L22 6V4H2z"/></svg>
              </span>
              <input value={company.email} onChange={(e)=>setCompany({...company, email:e.target.value})} readOnly={preview}/>
            </div>
            <div className="contact-line">
              <span className="ic">
                <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 2c2.5 0 4.7 1 6.3 2.6A8 8 0 0 1 14.7 6.6 8 8 0 0 1 12 4zm0 16a8 8 0 01-7.3-5h14.6A8 8 0 0112 20z"/></svg>
              </span>
              <input value={company.website} onChange={(e)=>setCompany({...company, website:e.target.value})} readOnly={preview}/>
            </div>
          </div>

          {/* Center: logo + brand (VRM yellow, GROUPS dark blue) */}
          <div className="header-center">
            <img
              src={logoSrc}
              alt="VRM Logo"
              className="logo-image"
              crossOrigin="anonymous"
              onError={() => { if (logoSrc !== LOGO_FALLBACK) setLogoSrc(LOGO_FALLBACK); }}
            />
            <div className="brand-badge">
              <span className="brand-vrm">VRM</span>
              <span className="brand-groups">GROUPS</span>
            </div>
          </div>

          {/* Right: address (icon on line-1) + GSTIN (with icon) */}
          <div className="header-right">
            <div className="addr-row">
              <span className="ic">
                <svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 00-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg>
              </span>
              <input value={company.address1} onChange={(e)=>setCompany({...company, address1:e.target.value})} readOnly={preview}/>
            </div>
            <div className="addr-row no-icon">
              <span className="ic" aria-hidden="true"></span>
              <input value={company.address2} onChange={(e)=>setCompany({...company, address2:e.target.value})} readOnly={preview}/>
            </div>
            <div className="addr-row no-icon">
              <span className="ic" aria-hidden="true"></span>
              <input value={company.address3} onChange={(e)=>setCompany({...company, address3:e.target.value})} readOnly={preview}/>
            </div>
            <div className="addr-row gst-row">
              <span className="ic">
                <svg viewBox="0 0 24 24"><path d="M3 5h18v14H3z" fill="none"/><path d="M5 7h14v2H5zm0 4h8v2H5zm0 4h6v2H5z"/></svg>
              </span>
              <input value={`GSTIN: ${company.gstin}`} readOnly />
            </div>
          </div>
        </header>

        <div className="invoice-title">Quotation</div>

        {/* Bill To & Site/Location */}
        <div className="bill-site-section">
          <div className="bill-to">
            <div className="section-title">Bill To:</div>
            <div className="field-group">
              <div className="field"><label>Name:</label><input value={billTo.name} onChange={(e)=>setBillTo({...billTo, name:e.target.value})} readOnly={preview}/></div>
              <div className="field"><label>Address:</label><input value={billTo.address} onChange={(e)=>setBillTo({...billTo, address:e.target.value})} readOnly={preview}/></div>
              <div className="field"><label>Contact No.:</label><input value={billTo.contactNo} onChange={(e)=>setBillTo({...billTo, contactNo:e.target.value})} readOnly={preview}/></div>
              <div className="field"><label>GSTIN No.:</label><input value={billTo.gstin} onChange={(e)=>setBillTo({...billTo, gstin:e.target.value})} readOnly={preview}/></div>
              <div className="field"><label>State:</label><input value={billTo.state} onChange={(e)=>setBillTo({...billTo, state:e.target.value})} readOnly={preview}/></div>
            </div>
          </div>

          <div className="site-location">
            <div className="section-title">Site /Location:</div>
            <div className="field-group">
              <div className="field"><label>Name:</label><input value={siteLocation.name} onChange={(e)=>setSiteLocation({...siteLocation, name:e.target.value})} readOnly={preview}/></div>
              <div className="field"><label>Address:</label><input value={siteLocation.address} onChange={(e)=>setSiteLocation({...siteLocation, address:e.target.value})} readOnly={preview}/></div>
              <div className="field"><label>Contact No.:</label><input value={siteLocation.contactNo} onChange={(e)=>setSiteLocation({...siteLocation, contactNo:e.target.value})} readOnly={preview}/></div>
              <div className="field"><label>Invoice No.:</label><input value={invoice.number} onChange={(e)=>setInvoice({...invoice, number:e.target.value})} readOnly={preview}/></div>
              <div className="field"><label>Date:</label><input type="date" value={invoice.date} onChange={(e)=>setInvoice({...invoice, date:e.target.value})} readOnly={preview}/></div>
            </div>
          </div>
        </div>

        {/* Materials */}
        <div className="materials-table">
          <div className="table-header">
            <div className="col-num">#</div>
            <div className="col-category">Category</div>
            <div className="col-hsn">HSN</div>
            <div className="col-qty">QTY</div>
            <div className="col-unit">Unit</div>
            <div className="col-price">Price/Unit</div>
            <div className="col-disc">Disc</div>
            <div className="col-gst">GST</div>
            <div className="col-amount">Amount</div>
            {!preview && <div className="col-action">Action</div>}
          </div>

          {items.map((item, idx) => {
            // Count materials for numbering
            const materialIndex = items.slice(0, idx).filter(x => x.type === 'material').length + (item.type === 'material' ? 1 : 0);
            
            if (item.type === 'pagebreak') {
              // Don't show page breaks in preview mode
              if (preview) return null;
              return (
                <div key={item.id} className="no-print" style={{padding: '15px', background: '#fff3cd', border: '2px dashed #ffc107', textAlign: 'center', fontWeight: 'bold', color: '#856404', borderBottom: '2px solid var(--border)'}}>
                  📄 PAGE BREAK
                  <button 
                    className="remove-btn" 
                    onClick={() => removeItem(item.id)}
                    style={{marginLeft: '10px', padding: '6px 12px', background: '#dc3545', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
                  >
                    Remove
                  </button>
                </div>
              );
            }
            
            if (item.type === 'subject') {
              const textareaRef = React.createRef();
              
              const applyFormatting = (format) => {
                const textarea = textareaRef.current;
                if (!textarea) return;
                
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selectedText = item.content.substring(start, end);
                
                if (!selectedText) {
                  alert('Please select text to format');
                  return;
                }
                
                let formattedText = '';
                if (format === 'bold') {
                  formattedText = `**${selectedText}**`;
                } else if (format === 'italic') {
                  formattedText = `*${selectedText}*`;
                } else if (format === 'underline') {
                  formattedText = `__${selectedText}__`;
                }
                
                const newContent = item.content.substring(0, start) + formattedText + item.content.substring(end);
                updateSubject(item.id, newContent);
                
                // Set cursor position after formatted text
                setTimeout(() => {
                  textarea.focus();
                  textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
                }, 0);
              };
              
              // Convert markdown-style formatting to HTML for preview
              const renderFormattedContent = (text) => {
                if (!text) return '';
                let formatted = text;
                // Bold: **text**
                formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Italic: *text*
                formatted = formatted.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
                // Underline: __text__
                formatted = formatted.replace(/__(.*?)__/g, '<u>$1</u>');
                return formatted;
              };
              
              return (
                <div key={item.id} style={{padding: '10px', background: '#f0f8ff', borderBottom: '1px solid var(--border)'}}>
                  <strong style={{color: '#000000', marginBottom: '5px', display: 'block'}}>Subject/Note:</strong>
                  
                  {!preview && (
                    <div style={{marginBottom: '5px', display: 'flex', gap: '5px'}}>
                      <button
                        onClick={() => applyFormatting('bold')}
                        title="Bold (Select text first)"
                        style={{padding: '4px 8px', background: '#06e2ba', color: 'black', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold'}}
                      >
                        B
                      </button>
                      <button
                        onClick={() => applyFormatting('italic')}
                        title="Italic (Select text first)"
                        style={{padding: '4px 8px', background: '#06e2ba', color: 'black', border: 'none', borderRadius: '3px', cursor: 'pointer', fontStyle: 'italic'}}
                      >
                        I
                      </button>
                      <button
                        onClick={() => applyFormatting('underline')}
                        title="Underline (Select text first)"
                        style={{padding: '4px 8px', background: '#06e2ba', color: 'black', border: 'none', borderRadius: '3px', cursor: 'pointer', textDecoration: 'underline'}}
                      >
                        U
                      </button>
                      <span style={{fontSize: '12px', color: '#000', alignSelf: 'center', marginLeft: '10px'}}>
                        Select text and click format buttons
                      </span>
                    </div>
                  )}
                  
                  {preview ? (
                    <div 
                      style={{
                        width: '100%', 
                        minHeight: '60px', 
                        padding: '8px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px', 
                        fontFamily: 'Arial', 
                        fontSize: '16px', 
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.5'
                      }}
                      dangerouslySetInnerHTML={{ __html: renderFormattedContent(item.content) }}
                    />
                  ) : (
                    <textarea
                      ref={textareaRef}
                      value={item.content}
                      onChange={(e) => updateSubject(item.id, e.target.value)}
                      placeholder="Enter subject or notes... (Use formatting buttons for bold/italic/underline)"
                      style={{width: '100%', minHeight: '60px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'Arial', fontSize: '16px', resize: 'vertical'}}
                    />
                  )}
                  
                  {!preview && (
                    <button 
                      className="remove-btn" 
                      onClick={() => removeItem(item.id)}
                      style={{marginTop: '5px', padding: '6px 12px', background: '#dc3545', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            }
            
            // Material row
            return (
              <div key={item.id} className="table-row">
                <div className="col-num">{materialIndex}</div>
                <div className="col-category">
                  <div className="category-inputs">
                    <input 
                      value={item.category} 
                      onClick={(e) => {
                        if (!preview) {
                          e.preventDefault();
                          setCategoryModal({ show: true, itemId: item.id, text: item.category, field: 'category' });
                        }
                      }}
                      readOnly
                      placeholder="Main Category" 
                      className="category-input main-category"
                      style={{cursor: preview ? 'default' : 'pointer', color: '#000000'}}
                    />
                    <input 
                      value={item.subcategory} 
                      onClick={(e) => {
                        if (!preview) {
                          e.preventDefault();
                          setCategoryModal({ show: true, itemId: item.id, text: item.subcategory, field: 'subcategory' });
                        }
                      }}
                      readOnly
                      placeholder="Subcategory" 
                      className="category-input sub-category"
                      style={{cursor: preview ? 'default' : 'pointer', color: '#000000'}}
                    />
                  </div>
                </div>
                <div className="col-hsn"><input value={item.hsn} onChange={(e)=>updateMaterial(item.id,"hsn",e.target.value)} placeholder="HSN" readOnly={preview}/></div>
                <div className="col-qty"><input type="number" value={item.qty} onChange={(e)=>updateMaterial(item.id,"qty",e.target.value)} min="0" readOnly={preview}/></div>
                <div className="col-unit">
                  <select value={item.unit} onChange={(e)=>updateMaterial(item.id,"unit",e.target.value)} disabled={preview}>
                    <option>Nos</option><option>Kg</option><option>Ltr</option><option>Mtr</option><option>Sq.Ft</option><option>Box</option>
                  </select>
                </div>
                <div className="col-price"><input type="number" value={item.pricePerUnit} onChange={(e)=>updateMaterial(item.id,"pricePerUnit",e.target.value)} min="0" step="0.01" readOnly={preview}/></div>
                <div className="col-disc"><input type="number" value={item.discount} onChange={(e)=>updateMaterial(item.id,"discount",e.target.value)} min="0" max="100" step="0.01" readOnly={preview}/>%</div>
                <div className="col-gst"><input type="number" value={item.gst} onChange={(e)=>updateMaterial(item.id,"gst",e.target.value)} min="0" step="0.01" readOnly={preview}/>%</div>
                <div className="col-amount">₹{fmt(item.qty * item.pricePerUnit * (1 - item.discount/100))}</div>
                {!preview && (
                  <div className="col-action" style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
                    <button className="remove-btn" onClick={()=>removeItem(item.id)}>Remove</button>
                    <button 
                      onClick={() => addPageBreakAfter(item.id)}
                      title="Add page break after this category"
                      style={{
                        padding: '4px 8px',
                        background: '#ffc107',
                        color: '#000',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      📄
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* compact total row */}
          <div className="table-total-row">
            <div className="col-category total-label">Total</div>
            <div className="col-amount">₹{fmt(calculations.subtotal + calculations.discount)}</div>
          </div>
        </div>

        {!preview && (
          <div className="add-material-section no-print" style={{display: 'flex', gap: '10px', padding: '10px'}}>
            <button onClick={addMaterial} className="btn add-material">+ Add Material</button>
            <button onClick={addSubject} className="btn" style={{background: '#06e2ba', color: 'black', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>+ Add Subject</button>
            <button onClick={addPageBreak} className="btn" style={{background: '#ffc107', color: '#000', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>📄 Add Page Break</button>
          </div>
        )}

        {/* Bottom */}
        <div className="bottom-section">
          <div className="amount-words">
            <div className="label">Amount in words:</div>
            <div className="words-value">{numberToWords(Math.floor(calculations.grandTotal))}</div>
            <div className="bank-details">
              <div><strong>Account Number:</strong> 1672102000027186</div>
              <div><strong>Bank Name:</strong> IDBI Bank</div>
              <div><strong>A/c Holder Name:</strong> <span style={{color: '#f8bd5f', fontWeight: 'bold', fontFamily: 'Quantico, Impact, Arial Black, sans-serif'}}>VRM</span> <span style={{color: '#08263b', fontWeight: 'bold', fontFamily: 'Quantico, Impact, Arial Black, sans-serif'}}>GROUPS</span></div>
              <div><strong>IFSC Code:</strong> IBKL0001672</div>
              <div><strong>MMID:</strong> 9259362</div>
            </div>
          </div>

          <div className="totals-section">
            <div className="total-row">
              <span className="label">
                Sub Total:
                {!preview && (
                  <input
                    className="discount-input"
                    type="number"
                    value={manualSubtotal !== null ? manualSubtotal : calculations.subtotal}
                    onChange={(e)=>{
                      const val = Number(e.target.value || 0);
                      setManualSubtotal(val);
                    }}
                    onBlur={(e) => {
                      // Allow clearing to go back to calculated
                      if (e.target.value === '') setManualSubtotal(null);
                    }}
                    min="0"
                    step="0.01"
                    placeholder="Auto"
                    title="Enter custom subtotal or leave for auto-calculation"
                  />
                )}
              </span>
              <span className="value">₹{fmt(calculations.subtotal + calculations.discount)}</span>
            </div>
            <div className="total-row">
              <span className="label">
                Discount ({discountPercent}%):
                {!preview && (
                  <input className="discount-input" type="number" value={discountPercent}
                    onChange={(e)=>setDiscountPercent(Number(e.target.value || 0))}
                    min="0" max="100" step="0.1"/>
                )}
              </span>
              <span className="value">₹{fmt(calculations.discount)}</span>
            </div>
            <div className="total-row">
              <span className="label">
                SGST ({taxRates.sgst}%):
                {!preview && (
                  <input
                    className="discount-input tax-input"
                    type="number"
                    value={taxRates.sgst}
                    onChange={(e)=>setTaxRates(r=>({...r, sgst:Number(e.target.value || 0)}))}
                    min="0" max="100" step="0.1"
                  />
                )}
              </span>
              <span className="value">₹{fmt(calculations.sgst)}</span>
            </div>
            <div className="total-row">
              <span className="label">
                CGST ({taxRates.cgst}%):
                {!preview && (
                  <input
                    className="discount-input tax-input"
                    type="number"
                    value={taxRates.cgst}
                    onChange={(e)=>setTaxRates(r=>({...r, cgst:Number(e.target.value || 0)}))}
                    min="0" max="100" step="0.1"
                  />
                )}
              </span>
              <span className="value">₹{fmt(calculations.cgst)}</span>
            </div>
            <div className="total-row grand-total"><span className="label">Total:</span><span className="value">₹{fmt(calculations.grandTotal)}</span></div>
            <div className="total-row"><span className="label">Balance:</span><span className="value">₹{fmt(calculations.grandTotal)}</span></div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="terms-conditions">
          <div className="terms-title">STANDARD EXCLUSIONS/ TO BE PROVIDED BY THE CLIENT:</div>
          <div className="terms-list">
            <div className="term-item">1. Drinking water for the labourers to be provided by the client.</div>
            <div className="term-item">2. Utilities water for labourers to be provided by the client.</div>
            <div className="term-item">3. Electricity for all the work activities welding, Sheet fixing etc. at work site to be provided by the client.</div>
            <div className="term-item">4. In case of works carried at night, Lighting arrangements to be provided by the client.</div>
            <div className="term-item">5. Security to be arranged by the client.</div>
            <div className="term-item">6. All Statutory permissions to be obtained and provided by the client.</div>
            <div className="term-item">7. Any other item not specifically mention but required for the execution of work to be provided by the client.</div>
            <div className="term-item">8. Compacted ground for crane movement inside the building will be in client scope.</div>
          </div>
          
          <div className="terms-title" style={{marginTop: '15px'}}> PAYMENT TERMS:</div>
          <div className="terms-list">
            <div className="term-item">1. The above quote is exclusive of all duties and Taxes. GST at 18% extra on the above mentioned quote. Any increase or decrease in taxes at the time of billing will be into your account.</div>
            <div className="term-item">2. All payment to be made in the name of "<span style={{color: '#f8bd5f', fontWeight: 'bold', fontFamily: 'Quantico, Impact, Arial Black, sans-serif'}}>VRM</span> <span style={{color: '#08263b', fontWeight: 'bold', fontFamily: 'Quantico, Impact, Arial Black, sans-serif'}}>GROUPS</span>" Account payee only.</div>
            <div className="term-item">3. 25% of advance along with the confirmed purchase order.</div>
            <div className="term-item">4. Slab by slab payment has to be done.</div>
          </div>
          
          <div style={{marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingLeft: '5px', paddingRight: '5px'}}>
            <div style={{textAlign: 'left'}}>
              <div style={{marginBottom: '8px'}}>Thanking you and assuring you our best of our services.</div>
              {/* <div style={{marginTop: '15px', fontWeight: 'bold'}}>For VRM GROUPS</div> */}
              {/* <div style={{fontWeight: 'bold', marginTop: '5px'}}>Proprietor M.R. Venkatesh</div> */}
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontWeight: 'bold'}}>Proprietor of <span style={{color: '#f8bd5f', fontWeight: 'bold', fontFamily: 'Quantico, Impact, Arial Black, sans-serif'}}>VRM</span> <span style={{color: '#08263b', fontWeight: 'bold', fontFamily: 'Quantico, Impact, Arial Black, sans-serif'}}>GROUPS</span></div>
              {/* <div style={{fontWeight: 'bold'}}>M.R. Venkatesh</div> */}
            </div>
          </div>
        </div>
      </div>
        </>
      )}

      {/* Category/Subcategory Modal */}
      {categoryModal.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            border: '3px solid #06e2ba'
          }}>
            <h3 style={{marginTop: 0, marginBottom: '16px', color: '#000000', fontSize: '20px', fontWeight: '700'}}>
              Edit {categoryModal.field === 'category' ? 'Main Category' : 'Subcategory'}
            </h3>
            <textarea
              value={categoryModal.text}
              onChange={(e) => setCategoryModal({...categoryModal, text: e.target.value})}
              placeholder={`Enter ${categoryModal.field === 'category' ? 'main category' : 'subcategory'} text...`}
              autoFocus
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '12px',
                border: '2px solid #06e2ba',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
                resize: 'vertical',
                outline: 'none',
                backgroundColor: '#ffffff'
              }}
            />
            <div style={{display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'flex-end'}}>
              <button
                onClick={() => setCategoryModal({ show: false, itemId: null, text: '', field: 'category' })}
                style={{
                  padding: '10px 24px',
                  background: '#e0e0e0',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateMaterial(categoryModal.itemId, categoryModal.field, categoryModal.text);
                  setCategoryModal({ show: false, itemId: null, text: '', field: 'category' });
                }}
                style={{
                  padding: '10px 24px',
                  background: '#06e2ba',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '700'
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
