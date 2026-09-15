# Qimam Al Arab — Quotation Studio

Static, GitHub Pages-ready quotation builder with a premium A4 PDF layout inspired by the supplied Qimam Al Arab quotation design.

## Features
- English / Arabic PDF labels and RTL layout.
- Editable company information and replaceable logo.
- Unlimited line items with automatic amount, subtotal, tax and grand total calculations.
- Optional tax (toggle on/off) and custom percentage / label.
- Automatic multi-page quotation preview and repeated headers.
- Optional business / wedding & events / custom introduction.
- Browser-local login gate (front-end only).
- Automatic local draft saving, version snapshots and restore.
- Mandatory export/change note.
- Every PDF / print export creates a local audit log entry.
- CSV export of the local audit trail.
- One-click PDF via jsPDF + html2canvas when available; browser Print → Save as PDF fallback.
- Responsive editor with live A4 preview.

## Deploy to GitHub Pages
1. Create a new GitHub repository.
2. Upload all files and folders from this package to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then Save.
6. GitHub will provide the public Pages URL.

## Security note
This is a static GitHub Pages application. The login is only a convenience gate in front-end JavaScript and is not server-side security. Do not store sensitive business data or real secrets in it.

## PDF workflow
- Fill the quotation.
- Upload/confirm the logo.
- Add a mandatory export note under **Output**.
- Use **Download PDF**. If the direct renderer is blocked by the browser/network, use **Print / Save PDF** and select **Save as PDF**.

## Local data
Drafts, versions and audit logs are stored only in the browser's `localStorage`. Clearing browser storage removes them.
