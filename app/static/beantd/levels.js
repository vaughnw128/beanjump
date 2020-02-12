/*
    so that i dont have to build a map editor, maps are represented by 13x9 grids of text
    0 = high ground
    path blocks are ^ > < v
    represent direction of the path block
    (might make default high ground not buildable and add buildable ground later)
*/

var test = [`0000000000000
0000000000000
0000000v<<000
0000000v0^000
<<<<<00v0^<<<
0000^00v00000
0000^00v00000
0000^<<<00000
0000000000000`,{start_x: 12, start_y: 4}];