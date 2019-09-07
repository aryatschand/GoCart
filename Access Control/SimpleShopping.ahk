CoordMode, Pixel, Screen

count = 0

while(count<15)
{
MouseClick, left, 1590, 727
MouseClick, left, 1590, 727
MouseClick, left, 1590, 727

Sleep, 250

Send ^x

outputVar = %Clipboard%
Run https://saivedagiri.github.io/SimpleShoppingInternalTesting/key.html?key=%outputVar%
Send <!`t
Sleep, 250
count++
}
