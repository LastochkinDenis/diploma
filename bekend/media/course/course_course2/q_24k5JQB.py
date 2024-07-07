# def solution(roman: str) -> int:
#     roman_number = {
#         'CM': 900,
#         'CD': 400,
#         'XC': 90,
#         'XL': 40,
#         'IX': 9,
#         'IV': 4,
#         'M': 1000,
#         'D': 500,
#         'C': 100,
#         'L': 50,
#         'X': 10,        
#         'V': 5,
#         'I': 1,
#     }

#     roman = roman.upper().strip()
#     sum_roman = 0

#     for num in roman_number.keys():
#         sum_roman += roman.count(num) * roman_number[num]
#         roman = roman.replace(str(num), '')
    
#     return sum_roman

# print(solution(input()))
#MCCCICIX MCCCXCIX 
#https://www.codewars.com/kata/51b6249c4612257ac0000005/train/python

# def generate_hashtag(s):
    
#     massage = '#' + ''.join(s.title().split())

#     if len(massage) > 140 or '#':
#         return False
#     return massage

# print(generate_hashtag(input()))

# def cakes(recipe, available):
#     cakes_count = {}

#     for ingredient_recipe in recipe.keys():
#         ingredient_available = available.get(ingredient_recipe)
#         if not ingredient_available:
#             return 0
#         ingredient_count = ingredient_available // recipe[ingredient_recipe]
#         if ingredient_count <= 0:
#             return 0
#         cakes_count[ingredient_recipe] = ingredient_count
#     return min(cakes_count.values())

# print(cakes({'flour': 500, 'sugar': 200, 'eggs': 1}, {'flour': 1200, 'sugar': 1200, 'eggs': 5, 'milk': 200}))


# class Element:

#     def __init__(self, value) -> None:
#         self.value = value
#         self.next = None

# class LinkedList:

#     def __init__(self, head) -> None:
#         self.head = head
    
#     def push_first(self, new_element: Element):
#         if isinstance(new_element, Element):
#             raise
#         old_element = self.head
#         self.head = new_element
#         self.head.next = old_element
    
#     def put_first(self):
#         if self.head is not None:
#             self.head = self.head.next
#             return self.head.next
#         self.head = None
#         return None

#     def look_firs(self):
#         return set.head

# def valid_braces(string):
#     stek = []
#     for simbol in string:
#         if simbol == ')' or simbol == ']' or simbol == '}':
#             if stek:
#                 simbol2 = stek.pop() 
#             else:
#                 simbol2 = ''
#             if simbol2 == '(' and simbol == ')' or simbol2 == '[' and simbol == ']' \
#                 or simbol2 == '{' and simbol == '}':
#                 continue
#             else:
#                 return False
#         if simbol == '(' or simbol == '[' or simbol == '{':
#             stek.append(simbol)
#     if stek:
#         return False
#     return True


# print(valid_braces(r'(2 + 2) * [2 + 2]'))


#https://www.codewars.com/kata/5277c8a221e209d3f6000b56/train/python
# from re import sub

# def top_3_words(text):
#     text = sub('[-\"\\/:;<>,.!@#$%^&~`*=+_?)]', ' ', text).lower().split()
#     wordCount = {}
#     for word in text:
#         if word == '\''or word == '\'\'\'':
#             continue
#         if word in wordCount:
#             wordCount[word] += 1
#         wordCount.setdefault(word, 1)
    
#     return sorted(wordCount, key=(lambda x: -wordCount[x]))[:3]

# print(top_3_words('\'\''))

#https://www.codewars.com/kata/51e056fe544cf36c410000fb/train/python

# def rot13(message):
#     result_message = ''
#     for simbol in message:
#         simbolCode = ord(simbol.lower())
#         simbol13 = simbol
#         if 97 <= simbolCode <= 122:
#             # simbol13 = chr(97 + abs(simbolCode + 13 - 122))
#             simbolCode += 13
#             if simbolCode > 122:
#                 simbolCode = 96 + abs(simbolCode - 122)
#             simbol13 = chr(simbolCode)
#             if simbol.isupper():
#                 simbol13 = simbol13.upper()
#         result_message += simbol13
#     return result_message


# print(rot13('EBG13 rknzcyr.'))
import decimal
import math

def sum_strings(x, y):
    decimal.getcontext().Emax = 99999999
    if x == "":
        x = 0
    if y == "":
        y = 0
    return str(decimal.Decimal(x) + decimal.Decimal(y))


sum_strings("9999999999999999", "1")