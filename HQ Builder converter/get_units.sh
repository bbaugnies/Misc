$t = invoke-webrequest -uri "https://hq-builder.com/export/194985/txt"
$s = $t.content -split "\n"
$s | foreach {
    $matches =""
    if ($_ -match "^(?<name>[^&].*) \(\d+pt\.\)") {
        $matches['name'] -replace "\d+", "\d+" | add-content doc.txt 
    }
}
