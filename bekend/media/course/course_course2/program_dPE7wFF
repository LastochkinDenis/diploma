"""The LinkedList code from before is provided below.
Add three functions to the LinkedList.
"get_position" returns the element at a certain position.
The "insert" function will add an element to a particular
spot in the list.
"delete" will delete the first element with that
particular value.
Then, use "Test Run" and "Submit" to run the test cases
at the bottom."""


# class Element(object):
#     def __init__(self, value):
#         self.value = value
#         self.next = None
#
#
# class LinkedList(object):
#     def __init__(self, head=None):
#         self.head = head
#
#     def append(self, new_element):
#         current = self.head
#         # print(self.head.value, self.head.next, '-', new_element.value, new_element.next, sep='/')
#         if self.head:
#             while current.next:
#                 current = current.next
#             current.next = new_element
#         else:
#             self.head = new_element
#
#     def get_position(self, position):
#         """Get an element from a particular position.
#         Assume the first position is "1".
#         Return "None" if position is not in the list."""
#         element = self.head
#         for posit in range(1, position + 1):
#             if posit == position:
#                 return element
#
#             element = element.next
#
#             if element is None:
#                 break
#         return None
#
#     def insert(self, new_element, position):
#         """Insert a new node at the given position.
#         Assume the first position is "1".
#         Inserting at position 3 means between
#         the 2nd and 3rd elements."""
#         old_element = self.get_position(position)
#         beak_element = self.get_position(position - 1)
#         beak_element.next = new_element
#         new_element.next = old_element
#
#
#     def delete(self, value):
#         """Delete the first node with a given value."""
#         if value == 1:
#             self.head = self.get_position(2)
#         if value > 1:
#             delete_element = self.get_position(value)
#             if delete_element.next is None:
#                 self.get_position(value - 1).next = None
#             else:
#                 beak_element = self.get_position(value - 1)
#                 beak_element.next = self.get_position(value + 1)
#
#
# # Test cases
# # Set up some Elements
# e1 = Element(1)
# e2 = Element(2)
# e3 = Element(3)
# e4 = Element(4)
#
# # Start setting up a LinkedList
# ll = LinkedList(e1)
# ll.append(e2)
# ll.append(e3)
#
# # Test get_position
# # Should print 3
# print(ll.head.next.next.value)
# # Should also print 3
# print(ll.get_position(3).value)
#
# # Test insert
# ll.insert(e4,3)
# # Should print 4 now
# print(ll.get_position(3).value)
#
# # Test delete
# ll.delete(1)
# # Should print 2 now
# print(ll.get_position(1).value)
# # Should print 4 now
# print(ll.get_position(2).value)
# # Should print 3 now
# print(ll.get_position(3).value)
# ll.delete(2)
# print(ll.get_position(2).next)

"""Add a couple methods to our LinkedList class,
and use that to implement a Stack.
You have 4 functions below to fill in:
insert_first, delete_first, push, and pop.
Think about this while you're implementing:
why is it easier to add an "insert_first"
function than just use "append"?"""


class Element(object):
    def __init__(self, value):
        self.value = value
        self.next = None


class LinkedList(object):
    def __init__(self, head=None):
        self.head = head

    def append(self, new_element):
        current = self.head
        if self.head:
            while current.next:
                current = current.next
            current.next = new_element
        else:
            self.head = new_element

    def insert_first(self, new_element):
        "Insert new element as the head of the LinkedList"
        old_element = self.head
        self.head = new_element
        self.head.next = old_element

    # def delete_first(self):
    #     "Delete the first (head) element in the LinkedList as return it"
    #     last_element = self.head
    #
    #     if self.head:
    #
    #         self.head = last_element.next
    #         return last_element
    #     return None

    def delete_first(self):
        "Delete the first (head) element in the LinkedList as return it"
        deleted_element = self.head
        if self.head:
            self.head = deleted_element.next
            deleted_element.next = None
        return deleted_element


class Stack(object):
    def __init__(self, top=None):
        self.ll = LinkedList(top)

    def push(self, new_element):
        "Push (add) a new element onto the top of the stack"
        self.ll.insert_first(new_element)

    def pop(self):
        "Pop (remove) the first element off the top of the stack and return it"
        return self.ll.delete_first()


# Test cases
# Set up some Elements
e1 = Element(1)
e2 = Element(2)
e3 = Element(3)
e4 = Element(4)

# Start setting up a Stack
stack = Stack(e1)

# Test stack functionality
stack.push(e2)
stack.push(e3)
print(stack.pop().value)
print(stack.pop().value)
print(stack.pop().value)
print(stack.pop())
stack.push(e4)
print(stack.pop().value)