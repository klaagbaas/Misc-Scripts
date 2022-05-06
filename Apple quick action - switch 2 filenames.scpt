on run {input, parameters}
   
tell application "Finder"
   
   set sel to selection
   if (count of sel) ≠ 2 then
       display dialog "You must select a total of two items." buttons {"OK"} default button 1 cancel button 1 with icon stop
   else
       set file_1 to item 1 of sel
       set file_2 to item 2 of sel
   end if
   set x to name of file_1
   set y to name of file_2
   set name of file_1 to " " & x
   set name of file_2 to " " & y
   
   set temp_sel to selection
   set temp_file_1 to item 1 of temp_sel
   set temp_file_2 to item 2 of temp_sel
   
   set name of temp_file_1 to y
   set name of temp_file_2 to x
   
end tell    
   return input
end run
