from app.ai.ai_assistant import ask_ai


question = "What is Caesar Cipher?"

result = ask_ai(question)

print("\nQuestion:")
print(result["question"])

print("\nAI Answer:")
print(result["answer"])

print("\nSources Used:")
for i, source in enumerate(result["sources"], start=1):
    print(f"\n--- Source {i} ---")
    print(source[:500])