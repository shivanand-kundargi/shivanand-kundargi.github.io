# Shivanand Kundargi - Portfolio Website

A modern, responsive portfolio website built with HTML, CSS, and JavaScript, inspired by the clean design of academic portfolio sites.

## Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Interactive Navigation**: Smooth scrolling and active section highlighting
- **Mobile-First**: Optimized for mobile devices with hamburger menu
- **Fast Loading**: Optimized for performance and SEO
- **Accessibility**: Built with accessibility best practices

## Sections

- **Hero**: Eye-catching introduction with call-to-action buttons
- **About**: Personal introduction and social media links
- **Projects**: Showcase of your work with technology tags
- **Experience**: Professional experience timeline
- **Education**: Academic background
- **Skills**: Technical skills organized by category
- **Contact**: Contact information and social links

## Technologies Used

- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript
- Font Awesome Icons
- Google Fonts (Inter)

## Getting Started

### Local Development

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

### Customization

1. **Personal Information**: Update the content in `index.html` with your details
2. **Styling**: Modify `styles.css` to change colors, fonts, or layout
3. **Functionality**: Add or modify features in `script.js`

## Deployment to GitHub Pages

### Method 1: Using GitHub Web Interface

1. **Create a new repository** on GitHub:
   - Go to [GitHub](https://github.com)
   - Click "New repository"
   - Name it `yourusername.github.io` (replace with your GitHub username)
   - Make it public
   - Don't initialize with README (since you already have files)

2. **Upload your files**:
   - Click "uploading an existing file"
   - Drag and drop all your portfolio files
   - Commit the changes

3. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll down to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

4. **Access your site**:
   - Your portfolio will be available at `https://yourusername.github.io`

### Method 2: Using Git Command Line

1. **Initialize Git repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   ```

2. **Add GitHub remote**:
   ```bash
   git remote add origin https://github.com/yourusername/yourusername.github.io.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages** (same as Method 1, step 3)

## Custom Domain (Optional)

To use a custom domain:

1. **Add a CNAME file**:
   - Create a file named `CNAME` (no extension)
   - Add your domain name (e.g., `shivanandkundargi.com`)

2. **Configure DNS**:
   - Add a CNAME record pointing to `yourusername.github.io`

3. **Update GitHub Pages settings**:
   - In repository settings > Pages
   - Add your custom domain

## File Structure

```
portfolio/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
├── README.md           # This file
└── assets/             # Images and other assets (optional)
    ├── images/
    └── icons/
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized images and assets
- Minified CSS and JavaScript (for production)
- Fast loading times
- Mobile-optimized

## Contributing

Feel free to fork this project and customize it for your own portfolio!

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

- **Email**: shivanandkundargi992@gmail.com
- **LinkedIn**: [linkedin.com/in/shivanandkundargi](https://linkedin.com/in/shivanandkundargi)
- **GitHub**: [github.com/shivanandkundargi](https://github.com/shivanandkundargi)

---

**Note**: Remember to update all placeholder information (email, social links, project details, etc.) with your actual information before deploying!
