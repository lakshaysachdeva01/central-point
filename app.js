require('dotenv').config();  // Load environment variables from .env file
const { API_BASE_URL , WEBSITE_ID_KEY, S3_BASE_URL} = require('./config/config');
const { getWebsiteID } = require('./utils/helper');
const { getHomeDesktopBanner ,gettestimonial ,getAdBanner,getHomepopupBanner ,getclientle  } = require('./controller/homecontroller');
const { getBlog ,getBlogfull, getlatestblogs} = require('./controller/blogcontroller');
const { getgallery,getLatestGalleryImages} = require('./controller/gallerycontroller');
const { getProducts, getProductDetails, getProductsByCategory, getCategories ,getjobs,getjobdetails,getotherjobs} = require('./controller/productcontroller');
const { getStays, getStayDetails } = require('./controller/staycontroller');
const { getVenues, getVenueDetails } = require('./controller/venuecontroller');
const { getContactInfo } = require('./controller/contactcontroller');
const { CONTACT_ENQUIRY_DYNAMIC_FIELDS_KEYS ,JOB_ENQUIRY_DYNAMIC_FIELDS_KEYS , BOOKING_ENQUIRY_DYNAMIC_FIELDS_KEYS} = require('./config/config');

const express = require('express');
const path = require('path');
const app = express();
const port = 8000;
const metaLogoPath = "/assets/img/Logo/CPIMetaImage.jpg";
// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Define the views directory

// Serve static files (like CSS, images) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to fetch categories and contact info and make them available to all routes
app.use(async (req, res, next) => {
    try {
        const categories = await getCategories();
        console.log('🔧 Middleware - Categories loaded:', categories ? categories.length : 0);
        res.locals.categories = categories;
        
        const contactInfo = await getContactInfo();
        res.locals.contactInfo = contactInfo;
        
        next();
    } catch (error) {
        console.error('❌ Middleware - Error fetching categories:', error);
        res.locals.categories = [];
        res.locals.contactInfo = {
            phone: "+91 9876543210",
            email: "info@hotel.com",
            address: "Your Hotel Address, City, State, PIN Code"
        };
        next();
    }
});

app.get('/', async (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('Host');
    const websiteID = await getWebsiteID(); 
    const banners = await getHomeDesktopBanner();
    const testimonial = await gettestimonial();
    const blogs = await getBlog();
    const gallery= await getgallery();
    const products = await getProducts();
    const clients = await getclientle();
    const popupbanners = await getHomepopupBanner();
   const latestImages = await getLatestGalleryImages();
   const seoDetails = {
    title: "CPI Hotel - Luxury Accommodation & Event Venues",
    metaDescription: "Experience luxury hospitality at CPI Hotel. Premium rooms, elegant banquet halls, and exceptional dining. Perfect for weddings, corporate events, and leisure stays.",
    metaImage: `${baseUrl}/${metaLogoPath}`,
    keywords: "luxury hotel, banquet hall, event venue, wedding venue, hotel rooms, accommodation, fine dining, CPI Hotel",
    canonical: `${baseUrl}`,
};

   
    res.render('index', {body: "",baseUrl,latestImages, products, websiteID,popupbanners,testimonial,blogs,gallery,clients, API_BASE_URL,WEBSITE_ID_KEY, seoDetails,banners});
});


app.get('/about', async (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('Host');
    const seoDetails = {
        title: "About Us - CPI Hotel | Our Story & Hospitality Excellence",
        metaDescription: "Learn about CPI Hotel's commitment to luxury hospitality, exceptional service, and creating memorable experiences for guests and event organizers.",
        metaImage: `${baseUrl}/${metaLogoPath}`,
        keywords: "about CPI Hotel, hotel history, hospitality, luxury service, hotel team",
        canonical: `${baseUrl}/about`,
    };
    
   
    res.render('about', {body: "",baseUrl, seoDetails});
});



app.get('/gallery', async (req, res) => {
    try {
        const baseUrl = req.protocol + '://' + req.get('Host');
        console.log('🎨 Gallery route called');
        const gallery = await getgallery() || [];
        
        console.log('🎨 Gallery data in route:', {
            isArray: Array.isArray(gallery),
            length: Array.isArray(gallery) ? gallery.length : 'N/A',
            type: typeof gallery,
            firstItem: Array.isArray(gallery) && gallery.length > 0 ? gallery[0] : 'No items'
        });
        
        const seoDetails = {
            title: "Photo Gallery - CPI Hotel | Venues, Rooms & Events",
            metaDescription: "Explore our photo gallery showcasing luxury rooms, elegant banquet halls, event venues, and memorable celebrations at CPI Hotel.",
            metaImage: `${baseUrl}/${metaLogoPath}`,
            keywords: "hotel gallery, venue photos, room photos, event photos, hotel images, banquet hall images",
            canonical: `${baseUrl}/gallery`,
        };

        res.render('gallery', { body: "", gallery, seoDetails });
    } catch (error) {
        console.error('❌ Error in /gallery route:', error);
        console.error('❌ Error stack:', error.stack);
        res.status(500).render('404', { 
            error: 'Internal Server Error',
            message: 'Unable to load gallery. Please try again later.'
        });
    }
});
app.get('/gallery/:filter', async (req, res) => {
    try {
        const baseUrl = req.protocol + '://' + req.get('Host');
        const { filter } = req.params;
        const gallery = await getgallery() || [];

        const seoDetails = {
            title: `${filter.charAt(0).toUpperCase() + filter.slice(1)} Gallery - CPI Hotel`,
            metaDescription: `View our ${filter} photo gallery showcasing luxury accommodations, elegant venues, and memorable events at CPI Hotel.`,
            metaImage: `${baseUrl}/${metaLogoPath}`,
            keywords: `${filter} gallery, hotel ${filter}, ${filter} photos, CPI Hotel ${filter}`,
            canonical: `${baseUrl}/gallery/${filter}`,
        };

        res.render('gallery', { body: "", gallery, seoDetails });
    } catch (error) {
        console.error('Error in /gallery/:filter route:', error);
        res.status(500).render('404', { 
            error: 'Internal Server Error',
            message: 'Unable to load gallery. Please try again later.'
        });
    }
});




app.get('/contact', async (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('Host');
    const websiteID = await getWebsiteID(); 
    
    const seoDetails = {
        title: "Contact Us - CPI Hotel | Book Your Stay or Event",
        metaDescription: "Get in touch with CPI Hotel. Contact us for room bookings, event venue inquiries, or any questions. We're here to help make your stay or event perfect.",
        metaImage: `${baseUrl}/${metaLogoPath}`,
        keywords: "contact CPI Hotel, hotel booking, event booking, hotel inquiry, customer service",
        canonical: `${baseUrl}/contact`,
    };

    res.render('contact', { body: "", websiteID, API_BASE_URL, WEBSITE_ID_KEY, CONTACT_ENQUIRY_DYNAMIC_FIELDS_KEYS, seoDetails });
});



// app.get('/career', async (req, res) => {
//     const baseUrl = req.protocol + '://' + req.get('Host');
//     const websiteID = await getWebsiteID();
    
//     const seoDetails = {
//         title: "",
//         metaDescription: "",
//         metaImage: `${baseUrl}/${metaLogoPath}`,
//         keywords: "",
//         canonical: `${baseUrl}/career`,
//     };

//     res.render('career', { body: "", seoDetails, websiteID, API_BASE_URL, WEBSITE_ID_KEY, CAREER_ENQUIRY_DYNAMIC_FIELDS_KEYS });
// });


app.get('/posts', async (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('Host');
  
    const blogs = await getBlog();
    const seoDetails = {
        title: "Blog & Articles - CPI Hotel | Latest News & Updates",
        metaDescription: "Read our latest blog posts and articles about hospitality, events, travel tips, and updates from CPI Hotel.",
        metaImage: `${baseUrl}/${metaLogoPath}`,
        keywords: "hotel blog, hospitality articles, travel tips, event planning, hotel news",
        canonical: `${baseUrl}/posts`,
    };

    res.render('blogs', { body: "", blogs, baseUrl, seoDetails });
});


app.get('/jobs', async (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('Host');
    const jobs = await getjobs();
    const seoDetails = {
        title: "Careers - CPI Hotel | Join Our Team",
        metaDescription: "Explore career opportunities at CPI Hotel. Join our hospitality team and be part of creating exceptional guest experiences.",
        metaImage: `${baseUrl}/${metaLogoPath}`,
        keywords: "hotel jobs, hospitality careers, hotel employment, CPI Hotel careers",
        canonical: `${baseUrl}/jobs`,
    };
    
    res.render('jobs', { body: "", baseUrl, seoDetails, jobs });
});


app.get('/job/:slug', async (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('Host');
    const { slug } = req.params;
    const websiteID = await getWebsiteID();
    const job = await getjobdetails(slug);
    const otherJobs = await getotherjobs(slug);
    const seoDetails = {
        title: job?.seoDetails?.title || "Job Details - Maniram Steel",
        metaDescription: job?.seoDetails?.metaDescription || job?.description?.replace(/<[^>]*>/g, '').substring(0, 160) || "View job details and apply for this position at Maniram Steel.",
        metaImage: `${baseUrl}/${metaLogoPath}`,
        keywords: job?.seoDetails?.tags?.join(', ') || "job, career, employment",
        canonical: `${baseUrl}/job/${slug}`,
    };
    
    res.render('jobdetail', {
        body: "", 
        baseUrl, 
        seoDetails, 
        job, 
        otherJobs,
        websiteID,
        API_BASE_URL,
        WEBSITE_ID_KEY,
        JOB_ENQUIRY_DYNAMIC_FIELDS_KEYS
    });
});





// app.get('/products', async (req, res) => {
//     try {
//         const baseUrl = req.protocol + '://' + req.get('Host');
//         const categories = res.locals.categories || [];
        
//         // Always load ALL products - JavaScript will handle filtering
//         const products = await getProducts();
        
//         const seoDetails = {
//             title: "Our Products ",
//             metaDescription: "",
//             metaImage: `${baseUrl}/${metaLogoPath}`,
//             keywords: "",
//             canonical: `${baseUrl}/products`,
//         };

//         res.render('Products', { 
//             body: "", 
//             products, 
//             baseUrl, 
//             seoDetails, 
//             S3_BASE_URL, 
//             categoryName: null,
//             categories,
//             selectedCategoryId: null
//         });
//     } catch (error) {
//         console.error('Error loading products page:', error);
//         const baseUrl = req.protocol + '://' + req.get('Host');
//         const seoDetails = {
//             title: "Our Products - Passary Refractories",
//             metaDescription: "Explore our range of high-quality refractory products and solutions",
//             metaImage: `${baseUrl}/${metaLogoPath}`,
//             keywords: "refractory products, industrial materials, passary products",
//             canonical: `${baseUrl}/products`,
//         };
        
//         // Render page with empty products array
//         res.render('Products', { 
//             body: "", 
//             products: [], 
//             baseUrl, 
//             seoDetails, 
//             S3_BASE_URL, 
//             categoryName: null,
//             categories: res.locals.categories || [],
//             selectedCategoryId: null
//         });
//     }
// });


app.get('/rooms', async (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('Host');
    const stays = await getStays();
    
    const seoDetails = {
        title: "Rooms & Suites - CPI Hotel | Luxury Accommodation",
        metaDescription: "Discover our range of luxury rooms and suites at CPI Hotel. Premium amenities, comfortable accommodations, and exceptional service for a perfect stay.",
        metaImage: `${baseUrl}/${metaLogoPath}`,
        keywords: "hotel rooms, luxury suites, accommodation, deluxe rooms, hotel booking, CPI Hotel rooms",
        canonical: `${baseUrl}/rooms`,
    };

    res.render('stays', { body: "", stays, seoDetails });
});

app.get('/dining', async (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('Host');
    
    const seoDetails = {
        title: "Dining & Restaurant - CPI Hotel | Fine Dining Experience",
        metaDescription: "Experience exceptional dining at CPI Hotel's restaurant. Enjoy delicious cuisine, elegant ambiance, and impeccable service for breakfast, lunch, and dinner.",
        metaImage: `${baseUrl}/${metaLogoPath}`,
        keywords: "hotel restaurant, fine dining, restaurant menu, hotel dining, CPI Hotel restaurant",
        canonical: `${baseUrl}/dining`,
    };

    res.render('dining', { body: "", seoDetails });
});

app.get('/room/:slug', async (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('Host');
    const { slug } = req.params;
    const stay = await getStayDetails(slug);
    
    if (!stay) {
        return res.status(404).render('404', { 
            seoDetails: {
                title: "Room Not Found - CPI Hotel",
                metaDescription: "The requested room could not be found.",
                metaImage: `${baseUrl}/${metaLogoPath}`,
                keywords: "CPI Hotel, rooms",
                canonical: `${baseUrl}/room/${slug}`,
            }
        });
    }

    const seoDetails = {
        title: `${stay.title} - CPI Hotel | ${stay.tagline || 'Luxury Accommodation'}`,
        metaDescription: stay.listDescription || stay.description || `Experience luxury in our ${stay.title} at CPI Hotel. ${stay.stayDetails?.roomSize || ''} of comfort with premium amenities.`,
        metaImage: `${baseUrl}${stay.bannerImage}`,
        keywords: `${stay.title}, hotel room, luxury accommodation, ${stay.stayDetails?.bedType || ''}, ${stay.stayDetails?.roomSize || ''}, CPI Hotel`,
        canonical: `${baseUrl}/room/${slug}`,
    };

    res.render('staydetails', { body: "", stay, seoDetails });
});

app.get('/venues', async (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('Host');
    const venues = await getVenues();
    
    const seoDetails = {
        title: "Event Venues - CPI Hotel | Banquet Halls & Meeting Spaces",
        metaDescription: "Discover our premium event venues and banquet halls at CPI Hotel. Perfect for weddings, corporate events, meetings, and celebrations of all sizes.",
        metaImage: `${baseUrl}/${metaLogoPath}`,
        keywords: "event venues, banquet halls, wedding venues, meeting spaces, corporate events, party venues, CPI Hotel venues",
        canonical: `${baseUrl}/venues`,
    };

    res.render('venues', { body: "", venues, seoDetails });
});

app.get('/venue/:slug', async (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('Host');
    const { slug } = req.params;
    const venue = await getVenueDetails(slug);
    
    if (!venue) {
        return res.status(404).render('404', { 
            seoDetails: {
                title: "Venue Not Found - CPI Hotel",
                metaDescription: "The requested venue could not be found.",
                metaImage: `${baseUrl}/${metaLogoPath}`,
                keywords: "CPI Hotel, venues",
                canonical: `${baseUrl}/venue/${slug}`,
            }
        });
    }

    const capacity = venue.venueDetails?.capacity || '';
    const area = venue.venueDetails?.area || '';
    const suitableFor = venue.suitableFor?.join(', ') || '';
    
    const seoDetails = {
        title: `${venue.title} - CPI Hotel | ${venue.tagline || 'Event Venue'}`,
        metaDescription: venue.listDescription || venue.description || `Book ${venue.title} at CPI Hotel. ${capacity} capacity, ${area} of elegant space. Perfect for ${suitableFor || 'events'}.`,
        metaImage: `${baseUrl}${venue.bannerImage}`,
        keywords: `${venue.title}, ${venue.tagline}, event venue, banquet hall, ${capacity}, ${area}, ${suitableFor}, CPI Hotel`,
        canonical: `${baseUrl}/venue/${slug}`,
    };

    res.render('venuedetails', { body: "", venue, seoDetails });
});

app.get('/thankyou', async (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('Host');
    const seoDetails = {
        title: "Thank You - CPI Hotel",
        metaDescription: "Thank you for contacting CPI Hotel. We'll get back to you soon.",
        metaImage: `${baseUrl}/${metaLogoPath}`,
        keywords: "CPI Hotel, thank you",
        canonical: `${baseUrl}/thankyou`,
    } 
    res.render('thankyou', {body: "",seoDetails});
});




app.get('/blog/:slug', async (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('Host');
    const { slug } = req.params; // Extract slug from params
    const blogDetails = await getBlogfull(slug);
    
    if (!blogDetails) {
        return res.status(404).render('404', { 
            seoDetails: {
                title: "Blog Post Not Found - CPI Hotel",
                metaDescription: "The requested blog post could not be found.",
                metaImage: `${baseUrl}/${metaLogoPath}`,
                keywords: "CPI Hotel, blog",
                canonical: `${baseUrl}/blog/${slug}`,
            }
        });
    }
    
    const testimonial = await gettestimonial();
    const websiteID = await getWebsiteID(); 
   
    const adbanner = await getAdBanner();
    const blogs = await getBlog();
    const latestblog = await getlatestblogs(slug);
    
    // Extract description for meta (remove HTML tags and limit to 160 chars)
    const cleanDescription = blogDetails?.description 
        ? blogDetails.description.replace(/<[^>]*>/g, '').substring(0, 160).trim() 
        : '';
    
    // Get meta image from blog banner or use default
    let metaImage = `${baseUrl}/${metaLogoPath}`;
    if (blogDetails?.banner?.bannerType === 'IMAGE' && blogDetails?.banner?.image) {
        metaImage = `${process.env.S3_BASE_URL || ''}${blogDetails.banner.image}`;
    }

    const seoDetails = {
        title: `${blogDetails.title || 'Blog Post'} - CPI Hotel`,
        metaDescription: cleanDescription || `Read our latest article: ${blogDetails.title || 'Blog Post'} at CPI Hotel.`,
        metaImage: metaImage,
        keywords: blogDetails?.tags?.join(', ') || blogDetails?.title || "CPI Hotel, blog, hospitality",
        canonical: `${baseUrl}/blog/${slug}`,
    };

    res.render('blogpost', {
        body: "",
       baseUrl,
       blogDetails,
        seoDetails,
        adbanner,
        latestblog,
        blogs,
       testimonial,websiteID,API_BASE_URL,WEBSITE_ID_KEY, BOOKING_ENQUIRY_DYNAMIC_FIELDS_KEYS
    });
});


// app.get('/product/:slug', async (req, res) => {
//     const baseUrl = req.protocol + '://' + req.get('Host');
//     const { slug } = req.params;
//     const productDetails = await getProductDetails(slug);
//     const websiteID = await getWebsiteID();
    
//     if (!productDetails) {
//         return res.redirect('/products');
//     }

//     const seoDetails = {
//         title: productDetails.title || "Product Details",
//         metaDescription: productDetails.description ? productDetails.description.replace(/<[^>]*>/g, '').substring(0, 160) : "",
//         metaImage: `${baseUrl}/${metaLogoPath}`,
//         keywords: productDetails.keywords || "",
//         canonical: `${baseUrl}/product/${slug}`,
//     };

//     res.render('details', {
//         body: "",
//         baseUrl,
//         product: productDetails,
//         seoDetails,
//         S3_BASE_URL,
//         API_BASE_URL,
//         WEBSITE_ID_KEY,
//         websiteID
//     });
// });

app.use(async (req, res, next) => {
    const baseUrl = req.protocol + '://' + req.get('Host');
    const seoDetails = {
        title: "Page Not Found - CPI Hotel",
        metaDescription: "The page you are looking for could not be found.",
        metaImage: `${baseUrl}/${metaLogoPath}`,
        keywords: "CPI Hotel, 404, page not found",
        canonical: baseUrl + req.originalUrl,
    };
    

    res.status(404).render('404', { seoDetails });
});




app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });