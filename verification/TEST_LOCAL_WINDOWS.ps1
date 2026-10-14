$ErrorActionPreference = 'Continue'
Write-Host 'MEDILINK LOCAL SMOKE CHECK' -ForegroundColor Cyan
$checks = @(
  @{Name='Backend TCP'; Url='http://127.0.0.1:4000/api/health'},
  @{Name='Frontend HTTP'; Url='http://127.0.0.1:5173/'}
)
foreach ($check in $checks) {
  try {
    $response = Invoke-WebRequest -Uri $check.Url -TimeoutSec 8 -UseBasicParsing
    Write-Host "PASS $($check.Name) - HTTP $($response.StatusCode)" -ForegroundColor Green
    if ($check.Name -eq 'Backend TCP') { Write-Host $response.Content }
  } catch {
    Write-Host "FAIL $($check.Name): $($_.Exception.Message)" -ForegroundColor Red
  }
}
Write-Host 'IMPORTANT: successful HTTP checks do not prove login, SMTP, GPS or payments work.'
