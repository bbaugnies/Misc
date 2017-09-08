$t = invoke-webrequest -uri "https://hq-builder.com/export/195050/txt"
$s = $t.content -split "\n"
$s | foreach {
    $matches =""
    if ($_ -match "^(?<name>[^&].*) \(\d+pt\.\)") {
        $matches['name'] -replace "\d+", "\d+" | add-content TK.txt 
    }
}
