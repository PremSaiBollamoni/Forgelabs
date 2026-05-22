$files = git ls-files --others --exclude-standard

# Function to get a proper commit message for a file
function Get-CommitMessage($file) {
    if ($file -eq ".gitignore") { return "chore: configure gitignore for frontend workspace" }
    if ($file -eq "DESIGN.md") { return "docs: document brand design system guidelines" }
    if ($file -eq "README.md") { return "docs: add initial project readme" }
    if ($file -eq "SKILL.md") { return "docs: add skill metadata documentation" }
    if ($file -eq "eslint.config.js") { return "chore: add eslint configuration" }
    if ($file -eq "package.json") { return "chore: add npm dependencies and scripts" }
    if ($file -eq "package-lock.json") { return "chore: lock npm dependencies version" }
    if ($file -eq "index.html") { return "feat: add main entry html file" }
    if ($file -eq "vite.config.js") { return "chore: configure vite build system" }
    if ($file -eq "apply-design.js" -or $file -eq "fix-fonts.js" -or $file -eq "revert-font.js") { return "chore: add design utility script" }
    if ($file -eq "build_error.txt") { return "chore: add build error log" }
    
    if ($file.StartsWith("public/")) {
        $name = [System.IO.Path]::GetFileNameWithoutExtension($file)
        return "assets: add $name asset icon"
    }
    if ($file -eq "src/index.css") { return "style: configure global styles and theme variables" }
    if ($file -eq "src/main.jsx") { return "feat: add main react entrypoint" }
    if ($file -eq "src/App.jsx") { return "feat: configure routes and central app structure" }
    if ($file -eq "src/App.css") { return "style: add app component styling" }
    if ($file -eq "src/api/axios.js") { return "feat: configure axios client for API communication" }
    if ($file -eq "src/services/authService.js") { return "feat: add authentication service client" }
    if ($file -eq "src/utils/cx.ts") { return "feat: add classnames utility function" }
    if ($file -eq "src/lib/utils.js") { return "feat: add tailwind-merge helper utility" }
    if ($file -eq "src/data/portfolioData.js") { return "data: add static portfolio dataset" }
    
    if ($file.StartsWith("src/base/buttons/")) {
        $name = [System.IO.Path]::GetFileNameWithoutExtension($file)
        return "feat: add $name button component"
    }
    if ($file.StartsWith("src/components/ui/")) {
        $name = [System.IO.Path]::GetFileNameWithoutExtension($file)
        return "feat: add $name custom UI component"
    }
    if ($file.StartsWith("src/components/")) {
        $name = [System.IO.Path]::GetFileNameWithoutExtension($file)
        return "feat: add $name layout component"
    }
    if ($file.StartsWith("src/pages/admin/")) {
        $name = [System.IO.Path]::GetFileNameWithoutExtension($file)
        return "feat: add admin $name dashboard view"
    }
    if ($file.StartsWith("src/pages/")) {
        $name = [System.IO.Path]::GetFileNameWithoutExtension($file)
        return "feat: add $name page view"
    }
    return "chore: add $file"
}

foreach ($file in $files) {
    if ([string]::IsNullOrWhiteSpace($file)) { continue }
    # Skip this script file itself
    if ($file -eq "push_files.ps1") { continue }
    
    $msg = Get-CommitMessage $file
    Write-Host "Staging $file..."
    git add $file
    Write-Host "Committing with message: $msg"
    git commit -m $msg
    Write-Host "Pushing $file to remote..."
    git push origin main
    Write-Host "---------------------------------------------"
}