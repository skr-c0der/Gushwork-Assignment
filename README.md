# Gushwork Assignment — Mangalam HDPE Pipes

A responsive, single-page marketing site for **Mangalam HDPE Pipes**, built with **vanilla HTML, CSS, and JavaScript** (no frameworks). Typography uses [**Inter**](https://fonts.google.com/specimen/Inter) via Google Fonts.

**Repository:** [github.com/skr-c0der/Gushwork-Assignment](https://github.com/skr-c0der/Gushwork-Assignment)

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
# Python 3
python3 -m http.server 8080

# Node (npx)
npx serve .
```

Then visit `http://localhost:8080` (port may vary).

## Features

- Sticky header with navigation, products dropdown, and **Contact Us** CTA  
- **Product hero:** breadcrumbs, BIS / ISO / CE certification pills, gallery with prev/next, thumbnails, hover zoom preview (desktop)  
- **Technical specifications** table (dark theme)  
- **Features** grid with custom icons (`package`, `needle`, `gear` assets)  
- **FAQ** accordion + catalogue email capture  
- **Applications** horizontal carousel  
- **Manufacturing process** tabbed content  
- **Testimonials** carousel  
- **Portfolio** cards + “Talk to an Expert” CTA (phone icon)  
- **Resources & Downloads** list  
- **Contact** strip with form and quote modal triggers  
- Modals: technical datasheet / quote request  

---

## Website screenshots

Below are captures of the implemented UI (design reference aligned with the Figma brief).

### Product hero

Certification badges, title, feature list, pricing card, gallery, and actions.

![Product hero — gallery, certifications, pricing, CTAs](docs/screenshots/09-product-hero.png)

### Trust bar & technical specifications

Partner logos strip and **Technical Specifications at a Glance** table.

![Trust bar and technical specifications section](docs/screenshots/01-trust-bar-and-specs.png)

### Features — “Built to Last. Engineered to Perform.”

Six feature cards with icons and **Request a Quote** CTA.

![Features grid section](docs/screenshots/07-features-grid.png)

### FAQ & catalogue

Accordion FAQ and email field to request the full catalogue.

![FAQ and catalogue request](docs/screenshots/04-faq-catalogue.png)

### Versatile applications

Industry cards in a horizontal carousel.

![Applications carousel](docs/screenshots/05-applications-carousel.png)

### Manufacturing process

Tabbed **Advanced HDPE Pipe Manufacturing Process** content.

![Manufacturing process tabs](docs/screenshots/11-manufacturing-process.png)

### Testimonials

**Trusted Performance. Proven Results** testimonial cards with navigation.

![Testimonials section](docs/screenshots/02-testimonials.png)

### Portfolio

**Complete Piping Solutions Portfolio** cards and expert CTA banner.

![Portfolio section](docs/screenshots/06-portfolio.png)

### Resources & downloads

PDF download rows with icons.

![Resources and downloads](docs/screenshots/03-resources-downloads.png)

### Contact CTA

Dark band with headline, copy, and **Contact Us Today** form.

![Contact section](docs/screenshots/10-contact-cta.png)

### Footer

Brand strip, link columns, contact details, and legal links.

![Footer](docs/screenshots/08-footer.png)

---

## Project structure

| Path | Description |
|------|-------------|
| `index.html` | Page markup and section structure |
| `styles.css` | Layout, components, responsive breakpoints |
| `script.js` | Gallery, modals, carousels, FAQ, header |
| `assets/` | Images, icons, and raster logos used in the UI |
| `docs/screenshots/` | README preview images |

## Tech stack

- HTML5  
- CSS3 (Grid, Flexbox, custom properties)  
- ES5/ES6 JavaScript (no build step)  

---

*Assignment for Gushwork — Mangalam HDPE Pipes product experience.*
