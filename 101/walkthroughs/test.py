from tkinter import *

def draw_shapes(a_canvas, start_x, start_y, number_of_rows):
    size = 50
    for row in range(number_of_rows): # for each row
        x = start_x + (number_of_rows - row - 1) * size # get starting x

        for i in range(2 * row + 1): # for each circle on the row
            a_canvas.create_oval(x, start_y, x + size, start_y + size, fill='blue') # print the circle
            x += size # add 50
        start_y += size







root = Tk()
root.title("My first Canvas")
a_canvas = Canvas(root, width=600, height=400)
a_canvas.pack(fill=BOTH, expand = True)
draw_shapes(a_canvas, 20, 30, 6)
root.mainloop()