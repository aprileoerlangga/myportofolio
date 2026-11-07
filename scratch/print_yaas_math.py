with open('scratch/yaas_home.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find the exact functions: Zt, lr, dr, and the loop that styles the cards!
idx = text.find('function lr(')
print('=== YAAS MATH FUNCTIONS ===')
print(text[idx-200:idx+1500])

