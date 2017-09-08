param (
   [Parameter(Mandatory=$true)][int]$start,
   [Parameter(Mandatory=$true)][string]$points,
   [int]$stop,
   [Parameter(Mandatory=$true)][string]$unit_file
)

$candidates = @()

$units = Get-content $unit_file
$pointStr = ".*\(\d+\/{0}pt\.\)" -f $points
$test = "hello", "bye"


while ($start -lt $stop){
    if ($start%100 -eq 0) {"done: $start"}
    $url = "https://hq-builder.com/export/{0}/txt" -f $start
    $viewrl = "https://hq-builder.com/shared/{0}" -f $start
    try {
        $t = Invoke-webrequest -Uri $url
    }
    catch{
        "error on $start"
    }
    
    if ($t.content -match $pointStr){
        $score = 0
        $units | foreach {
            if ($t.content -match $_){ $score ++}
        }
        if ($score -gt 0) {
            $candidates += , @($viewrl, $score)
        }
    }
    $start += 1
    
}
$candidates = $candidates | Sort-Object @{Expression={$_[1]}}
$candidates
