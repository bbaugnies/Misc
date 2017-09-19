param (
   [Parameter(Mandatory=$true)][int]$start,
   [Parameter(Mandatory=$true)][string]$points,
   [Parameter(Mandatory=$true)][int]$stop,
   [Parameter(Mandatory=$true)][string]$unit_file
)

$candidates = @()

$units = Get-content $unit_file
$pointStr = ".*\(\d+\/{0}pt\.\)" -f $points
$test = "hello", "bye"

$fails = 0

while ($start -lt $stop -and $fails -lt 10){
    if ($start%100 -eq 0) {"done: $start"}
    $url = "https://hq-builder.com/export/{0}/txt" -f $start
    $viewrl = "https://hq-builder.com/shared/{0}" -f $start
    $start += 1
    try {
        $t = Invoke-webrequest -Uri $url
    }
    catch{
	$fails += 1
	"error on {0}, {1} consecutive" -f ($start-1), $fails
	continue
    }
    $fails = 0
    if ($t.content -match $pointStr){
        $score = 0
        $units | foreach {
            if ($t.content -match $_){ $score ++}
        }
        if ($score -gt 0) {
            $candidates += , @($viewrl, $score)
        }
    }
    
}
$candidates = $candidates | Sort-Object @{Expression={$_[1]}}
$candidates
