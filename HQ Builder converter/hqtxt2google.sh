param (
   [Parameter(Mandatory=$true)][string]$in_file
)
$in_file += "/txt"
$t = curl $in_file | out-string
$m = $m = $t -match '(?smi)textarea id.*>(?<text>.*)<\/textarea'
$m = $matches['text'] -split '\n'

$content = $m | where {$_ -match '^[^@\s]'} | foreach {$_.trim()}
$t = $content[0] -match '\((?<total>\d+\/\d+)pt\.\)'
$total = $matches['total']
$content = $content[2..($content.length - 1)]
$content += "end"

$units = @()
$curUnit = ""
$regUnit = 1
$baseOptions = @()
for ($i = 0; $i -lt $content.length; $i ++) {
    if ($content[$i] -match '^\w'){
        $options = @()
        if ($curUnit -ne "") {
            # handle baseOptions
            $baseOptions | foreach {
                $t = $_, $curUnit.Amount, 0
                $curUnit.Opt += , $t
            }
            $units += $curUnit
        }
        $curUnit = New-Object System.Object
        $baseOptions = @()
        $l = $content[$i] -split '[\-\(\);]' | foreach {$_.trim()}
        
        if ($l[0] -match '^(?<amount>\d+)x') {
            $regUnit = 1
            $curUnit | add-member -type NoteProperty -name Amount -value $matches['amount']
            $curUnit | add-member -type NoteProperty -name Name -value $l[1]
            if($l[2] -match '(?<totalCost>\d+)pt\.') {
                $curUnit | add-member -type NoteProperty -name totalCost -value $matches['totalCost']
            }
            $curUnit | add-member -type NoteProperty -name Lore -value ""
            $curUnit | add-member -type NoteProperty -name Opt -value $options
        }
        else {
            $regUnit = 0
            $curUnit | add-member -type NoteProperty -name Amount -value 1
            $curUnit | add-member -type NoteProperty -name Name -value $l[0]
            if($l[1] -match '(?<totalCost>\d+)pt\.') {
                $curUnit | add-member -type NoteProperty -name totalCost -value $matches['totalCost']
                $curUnit | add-member -type NoteProperty -name unitCost -value $matches['totalCost']
            }
            if($l[2] -match 'Level \d Wizard'){
                $t = $l[2], 1, 0
                $options += , $t
                $curUnit | add-member -type NoteProperty -name Lore -value $l[3]
                foreach($o in $l[4..($l.length-1)]) {
                    if ($o -ne "") {
                        $t = $o, 1, 0
                        $options += , $t
                    }
                }
            }
            else {
                $curUnit | add-member -type NoteProperty -name Lore -value ""
                foreach($o in $l[2..($l.length-1)]) {
                    if ($o -ne "") {
                        $t = $o, 1, 0
                        $options += , $t
                    }
                }
            }
            $curUnit | add-member -type NoteProperty -name Opt -value $options
        }
     }
     
     elseif ($content[$i] -match '^\#' -and -not $regUnit) {
        $t = $content[$i] -match '\# (?<opt>.+) \((?<opt_cost>\d+)pt\.'
        $curUnit.unitCost -= $matches['opt_cost']
        $t = $matches['opt'], 1,  ([int]$matches['opt_cost']+[int]$curUnit.unitCost)
        $curUnit.Opt += , $t
     }
     
     # issue if an option has more than 1 occurence
     elseif ($content[$i] -match '^&' -and $regUnit) {
        $l = $content[$i] -split ';' | foreach {$_.trim()}
        if ($l[1] -match '1x \- (?<opt>.*) \((?<opt_cost>\d+)pt\.\)') {
            $t = $matches['opt'], 1, $matches['opt_cost']
            $curUnit.Opt += , $t
        }
        else {
            $t = $l[1] -match '\((?<unitCost>\d+)pt.\)'
            $curUnit | add-member -type NoteProperty -name unitCost -value $matches['unitCost']
        }
        if ($baseOptions.count -eq 0) {
            foreach($o in $l[2..($l.length-1)]) {
                if ($_ -ne "") {
                    $baseOptions += $o
                }
            }
        }
        else {
            $options = $l[2..($l.length-2)]
            $intersection = $options | ?{$baseOptions -contains $_}
            $union = ($options + $baseOptions) | select -uniq
            $diff = $union | ?{$intersection -notcontains $_}
            $baseOptions = $intersection
            $diff | foreach {
                if ($_ -ne "") {
                    $t = $_, 1, 0
                    $curUnit.Opt += , $t
                }
            }
        }
     }
}
foreach ($u in $units) {
    foreach ($o in $u.Opt) {
        if ($o[2] -gt 0) { $o[2] -= $u.unitCost}
    }
}
$out_file = $in_file[-10..-5]+".csv" -join ""




"{0}`n`n, , Nom, Equipement, Nombre, Prix/unité, , Prix, Total`n" -f $total | set-content $out_file
$units | foreach { 
    ", , {0}, {1}, {2}, {3}, , , , , , M, CC, CT, F, E, PV, I, A, Cd, Arm, Inv" -f $_.Name, $_.Lore, $_.Amount, $_.unitCost | add-content $out_file
    $_.Opt | foreach {
        ", , , {0}, {1}, {2}" -f $_[0], $_[1], $_[2] | add-content $out_file
    }
    ", , , , , , , , {0}`n`n" -f $_.totalCost | add-content $out_file
}



python3 quickstart.py $out_file







