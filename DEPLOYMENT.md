# GitHub Pages Deployment Guide

This guide will help you deploy your portfolio website to GitHub Pages for free hosting.

## Prerequisites

- A GitHub account
- Git installed on your computer (optional, you can use GitHub web interface)

## Step-by-Step Deployment

### Option 1: Using GitHub Web Interface (Recommended for beginners)

1. **Create a new repository on GitHub**:
   - Go to [github.com](https://github.com) and sign in
   - Click the "+" icon in the top right corner
   - Select "New repository"
   - Repository name: `yourusername.github.io` (replace `yourusername` with your actual GitHub username)
   - Description: "My personal portfolio website"
   - Make sure it's set to **Public**
   - **Do NOT** check "Add a README file" (since you already have files)
   - Click "Create repository"

2. **Upload your files**:
   - On the new repository page, click "uploading an existing file"
   - Drag and drop all your portfolio files:
     - `index.html`
     - `styles.css`
     - `script.js`
     - `README.md`
     - `.gitignore`
   - Add a commit message: "Add portfolio website files"
   - Click "Commit changes"

3. **Enable GitHub Pages**:
   - Go to your repository settings (click "Settings" tab)
   - Scroll down to the "Pages" section in the left sidebar
   - Under "Source", select "Deploy from a branch"
   - Branch: select "main"
   - Folder: select "/ (root)"
   - Click "Save"

4. **Access your website**:
   - Your portfolio will be available at: `https://yourusername.github.io`
   - It may take a few minutes to deploy initially

### Option 2: Using Git Command Line

1. **Set up Git** (if not already done):
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

2. **Add GitHub remote**:
   ```bash
   git remote add origin https://github.com/yourusername/yourusername.github.io.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages** (same as Option 1, step 3)

## Custom Domain Setup (Optional)

If you want to use your own domain (e.g., `shivanandkundargi.com`):

1. **Create a CNAME file**:
   - In your repository, create a new file called `CNAME` (no extension)
   - Add your domain name: `yourdomain.com`
   - Commit the changes

2. **Configure your domain's DNS**:
   - Add a CNAME record pointing to `yourusername.github.io`
   - Or add A records pointing to GitHub's IP addresses:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153

3. **Update GitHub Pages settings**:
   - In repository settings > Pages
   - Add your custom domain in the "Custom domain" field
   - Check "Enforce HTTPS"

## Updating Your Website

### Using GitHub Web Interface:
1. Go to your repository
2. Click on the file you want to edit
3. Click the pencil icon to edit
4. Make your changes
5. Commit the changes

### Using Git Command Line:
```bash
# Make your changes to files
git add .
git commit -m "Update portfolio content"
git push origin main
```

## Troubleshooting

### Website not loading:
- Check that your repository is public
- Verify GitHub Pages is enabled in settings
- Wait 5-10 minutes for changes to propagate
- Check the Actions tab for any deployment errors

### Custom domain not working:
- Verify DNS settings are correct
- Wait up to 24 hours for DNS propagation
- Check that CNAME file is in the root directory
- Ensure domain is added in GitHub Pages settings

### Styling issues:
- Clear your browser cache
- Check for any syntax errors in CSS/HTML
- Use browser developer tools to debug

## Best Practices

1. **Keep your repository updated**: Regularly commit and push changes
2. **Test locally**: Always test your website locally before pushing changes
3. **Use meaningful commit messages**: Describe what you changed
4. **Backup your work**: Keep local copies of your files
5. **Monitor your site**: Check that your website is working regularly

## Security Considerations

- Never commit sensitive information (passwords, API keys)
- Use environment variables for sensitive data
- Keep your repository public for free GitHub Pages hosting
- Regularly update dependencies if you add any

## Performance Tips

- Optimize images before uploading
- Use a CDN for faster loading
- Minimize CSS and JavaScript files
- Enable GitHub Pages caching

## Support

If you encounter issues:
1. Check GitHub's documentation: [docs.github.com](https://docs.github.com)
2. Search GitHub Community: [github.community](https://github.community)
3. Check GitHub Pages documentation: [pages.github.com](https://pages.github.com)

---

**Your portfolio website will be live at: `https://yourusername.github.io`**

Remember to replace `yourusername` with your actual GitHub username!
