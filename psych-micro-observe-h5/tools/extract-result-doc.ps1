$ErrorActionPreference = 'Stop'
$dir = Join-Path $PSScriptRoot '..\docs'
$docFile = Get-ChildItem -LiteralPath $dir -Filter '*.doc' -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $docFile) {
  Write-Error "No .doc file in docs folder"
  exit 1
}
$path = $docFile.FullName
$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
  $doc = $word.Documents.Open($path)
  $text = $doc.Content.Text
  $doc.Close([ref]$false)
  [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
  [Console]::Out.Write($text)
} finally {
  $word.Quit([ref]0)
  [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
}
