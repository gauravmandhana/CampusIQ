from app.ai.pdf_extractor import extract_text_from_pdf


pdf_path = r"E:\College Project\ai_documents\notes\Data_Communication.pdf.pdf"

text = extract_text_from_pdf(pdf_path)

print("PDF text extracted successfully!")
print("\nExtracted text:\n")
print(text[:3000])