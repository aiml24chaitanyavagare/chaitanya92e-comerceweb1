/* ================================================================
   ZAPKART — script.js   (single file, replaces app.js + features.js)
   Features:
     ✅ Login Gate  — Google login  |  Mobile OTP
     ✅ Real GPS    — browser geolocation
     ✅ Live Map    — Leaflet + OpenStreetMap (no API key needed)
     ✅ Order Track — animated steps + map pin
     ✅ Checkout    — Address → Payment → Confirm
     ✅ About Us, FAQ, Returns, Contact modals
     ✅ Cart, Wishlist, Search, Filters
     ✅ Hero Slider, Countdown Timer, Scroll Animations
   ================================================================ */

"use strict";

/* ────────────────────────────────────────────────────────────────
   SECTION 0 — INJECT ALL STYLES (login gate + modals + map)
   ──────────────────────────────────────────────────────────────── */
(function injectStyles() {
  const s = document.createElement("style");
  s.textContent = `
  /* ── LOGIN GATE ── */
  #zk-login-gate{
    position:fixed;inset:0;z-index:9999;
    background:linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%);
    display:flex;align-items:center;justify-content:center;
    transition:opacity .6s ease;
  }
  #zk-login-gate.hide{opacity:0;pointer-events:none;}
  .gate-box{
    background:#fff;border-radius:28px;width:100%;max-width:420px;
    overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,.4);
    margin:1rem;
  }
  .gate-header{
    background:linear-gradient(135deg,#ff416c,#a18cd1);
    padding:2.5rem 2rem 1.8rem;text-align:center;color:#fff;
  }
  .gate-logo{font-family:'Bebas Neue',sans-serif;font-size:3rem;letter-spacing:4px;}
  .gate-header p{opacity:.85;font-size:.9rem;margin-top:.3rem;}
  .gate-body{padding:2rem;}
  .gate-tabs{display:flex;border:2px solid #f0f0f0;border-radius:14px;overflow:hidden;margin-bottom:1.8rem;}
  .gate-tab{
    flex:1;padding:.75rem;text-align:center;font-weight:800;font-size:.88rem;
    cursor:pointer;background:#fff;color:#888;border:none;
    font-family:'Nunito',sans-serif;transition:all .25s;
  }
  .gate-tab.active{background:linear-gradient(135deg,#ff416c,#a18cd1);color:#fff;}
  .gate-panel{display:none;} .gate-panel.show{display:block;}
  /* Google button */
  .google-btn{
    width:100%;padding:.9rem;border:2px solid #e0e0e0;border-radius:14px;
    background:#fff;display:flex;align-items:center;justify-content:center;
    gap:.8rem;font-family:'Nunito',sans-serif;font-weight:700;font-size:.95rem;
    cursor:pointer;transition:all .3s;color:#333;margin-bottom:1rem;
  }
  .google-btn:hover{border-color:#ff416c;box-shadow:0 4px 15px rgba(255,65,108,.2);}
  .google-icon{width:22px;height:22px;}
  .gate-divider{display:flex;align-items:center;gap:.8rem;margin:1rem 0;color:#ccc;font-size:.8rem;}
  .gate-divider::before,.gate-divider::after{content:'';flex:1;height:1px;background:#e8e8e8;}
  .gate-input{
    width:100%;padding:.8rem 1.1rem;border:2px solid #e8e8e8;border-radius:12px;
    font-family:'Nunito',sans-serif;font-size:.95rem;outline:none;
    margin-bottom:1rem;transition:border-color .25s;
  }
  .gate-input:focus{border-color:#ff416c;}
  .gate-btn{
    width:100%;padding:.9rem;border:none;border-radius:14px;
    background:linear-gradient(135deg,#ff416c,#a18cd1);color:#fff;
    font-family:'Nunito',sans-serif;font-weight:800;font-size:1rem;
    cursor:pointer;transition:all .3s;
  }
  .gate-btn:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(255,65,108,.4);}
  .gate-btn.secondary{background:#fff;color:#ff416c;border:2px solid #ff416c;margin-top:.7rem;}
  .gate-btn.secondary:hover{background:#fff5f7;box-shadow:none;}
  .otp-row{display:flex;gap:.5rem;justify-content:center;margin-bottom:1.2rem;}
  .otp-digit{
    width:48px;height:56px;border:2px solid #e0e0e0;border-radius:12px;
    text-align:center;font-size:1.4rem;font-weight:800;font-family:'Nunito',sans-serif;
    outline:none;transition:border-color .25s;
  }
  .otp-digit:focus{border-color:#ff416c;}
  .gate-error{color:#ff416c;font-size:.8rem;font-weight:700;margin-bottom:.8rem;display:none;}
  .gate-error.show{display:block;}
  .gate-success-msg{color:#21d190;font-size:.82rem;font-weight:700;margin-bottom:.8rem;text-align:center;}
  .resend-link{font-size:.8rem;color:#ff416c;cursor:pointer;font-weight:700;text-decoration:underline;}
  .gate-user-bar{
    position:fixed;top:0;right:0;z-index:210;
    display:none;align-items:center;gap:.7rem;
    padding:.5rem 1.2rem;background:#fff;
    border-bottom-left-radius:14px;
    box-shadow:0 4px 15px rgba(0,0,0,.1);
  }
  .gate-user-bar.show{display:flex;}
  .user-avatar{
    width:36px;height:36px;border-radius:50%;
    background:linear-gradient(135deg,#ff416c,#a18cd1);
    color:#fff;font-weight:800;font-size:.85rem;
    display:flex;align-items:center;justify-content:center;
  }
  .user-name{font-size:.82rem;font-weight:700;color:#333;}
  .logout-btn{
    font-size:.75rem;color:#ff416c;font-weight:700;
    cursor:pointer;text-decoration:underline;border:none;background:none;
    font-family:'Nunito',sans-serif;
  }

  /* ── GENERIC MODAL ── */
  .zk-backdrop{
    position:fixed;inset:0;z-index:900;
    background:rgba(0,0,0,.55);backdrop-filter:blur(6px);
    display:flex;align-items:center;justify-content:center;
    opacity:0;pointer-events:none;transition:opacity .35s;padding:1rem;
  }
  .zk-backdrop.open{opacity:1;pointer-events:all;}
  .zk-modal{
    background:#fff;border-radius:24px;width:100%;max-width:580px;
    max-height:90vh;overflow-y:auto;
    box-shadow:0 30px 80px rgba(0,0,0,.25);
    transform:translateY(40px) scale(.97);
    transition:transform .35s cubic-bezier(.4,0,.2,1);
    scrollbar-width:thin;
  }
  .zk-backdrop.open .zk-modal{transform:translateY(0) scale(1);}
  .zk-modal-wide{max-width:860px;}
  .zk-head{
    padding:1.4rem 1.6rem 1rem;
    display:flex;align-items:center;justify-content:space-between;
    border-bottom:1px solid #f0f0f0;
    position:sticky;top:0;background:#fff;z-index:2;
    border-radius:24px 24px 0 0;
  }
  .zk-head h2{font-size:1.25rem;font-weight:800;}
  .zk-close-btn{
    width:36px;height:36px;border-radius:50%;
    border:1.5px solid #e0e0e0;background:#fff;
    font-size:1rem;cursor:pointer;
    display:flex;align-items:center;justify-content:center;
    transition:all .2s;
  }
  .zk-close-btn:hover{background:#ff416c;border-color:#ff416c;color:#fff;}
  .zk-body{padding:1.6rem;}
  .zk-grad-head{
    padding:2rem 1.6rem 1.4rem;
    background:linear-gradient(135deg,#ff416c,#a18cd1);
    border-radius:24px 24px 0 0;color:#fff;text-align:center;
  }
  .zk-grad-head .gicon{font-size:3rem;margin-bottom:.5rem;}
  .zk-grad-head h2{font-size:1.5rem;font-weight:800;}
  .zk-grad-head p{font-size:.88rem;opacity:.85;margin-top:.3rem;}

  /* ── FORM FIELDS ── */
  .zk-field{margin-bottom:1.1rem;}
  .zk-label{display:block;font-size:.78rem;font-weight:800;color:#666;margin-bottom:.4rem;text-transform:uppercase;letter-spacing:.8px;}
  .zk-input,.zk-select,.zk-textarea{
    width:100%;padding:.72rem 1rem;border:2px solid #e8e8e8;border-radius:12px;
    font-family:'Nunito',sans-serif;font-size:.92rem;color:#222;
    outline:none;transition:border-color .25s;background:#fafafa;
  }
  .zk-input:focus,.zk-select:focus,.zk-textarea:focus{border-color:#ff416c;background:#fff;}
  .zk-textarea{resize:vertical;min-height:90px;}
  .zk-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
  .zk-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.8rem;}
  .zk-btn{
    width:100%;padding:.85rem;
    background:linear-gradient(135deg,#ff416c,#a18cd1);
    border:none;border-radius:14px;color:#fff;
    font-family:'Nunito',sans-serif;font-size:1rem;font-weight:800;
    cursor:pointer;transition:all .3s;letter-spacing:.5px;
  }
  .zk-btn:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(255,65,108,.4);}
  .zk-btn.secondary{background:#fff;color:#ff416c;border:2px solid #ff416c;margin-top:.6rem;}
  .zk-btn.secondary:hover{background:#fff5f7;box-shadow:none;}
  .zk-btn.green{background:linear-gradient(135deg,#21d190,#4facfe);}
  .zk-error{font-size:.78rem;color:#ff416c;margin-top:.3rem;display:none;}
  .zk-error.show{display:block;}

  /* ── MAP ── */
  #zk-map{height:280px;border-radius:16px;margin-bottom:1.2rem;z-index:1;}
  .map-loading{
    height:280px;border-radius:16px;margin-bottom:1.2rem;
    background:linear-gradient(135deg,#f0f2f8,#e8eaf0);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    color:#888;gap:.5rem;font-weight:700;
  }
  .map-loading .spin{
    width:36px;height:36px;border:4px solid #e0e0e0;
    border-top-color:#ff416c;border-radius:50%;
    animation:spin .8s linear infinite;
  }
  @keyframes spin{to{transform:rotate(360deg)}}
  .loc-info-bar{
    background:#f8f9ff;border-radius:12px;padding:.9rem 1.1rem;
    display:flex;gap:.8rem;align-items:center;margin-bottom:1rem;
    font-size:.85rem;
  }
  .loc-info-bar .loc-icon{font-size:1.4rem;}
  .loc-info-bar strong{display:block;font-weight:800;font-size:.88rem;}
  .loc-info-bar span{color:#888;font-size:.78rem;}

  /* ── STEPPER ── */
  .zk-stepper{display:flex;align-items:center;gap:0;margin-bottom:1.8rem;}
  .zk-step{flex:1;text-align:center;position:relative;}
  .zk-step-circle{
    width:36px;height:36px;border-radius:50%;
    background:#f0f0f0;color:#aaa;
    display:flex;align-items:center;justify-content:center;
    font-size:.85rem;font-weight:800;margin:0 auto .4rem;transition:all .3s;
  }
  .zk-step.active .zk-step-circle{background:linear-gradient(135deg,#ff416c,#a18cd1);color:#fff;}
  .zk-step.done .zk-step-circle{background:#21d190;color:#fff;}
  .zk-step-label{font-size:.72rem;font-weight:700;color:#bbb;}
  .zk-step.active .zk-step-label,.zk-step.done .zk-step-label{color:#333;}
  .zk-step-line{flex:0 0 36px;height:2px;background:#e8e8e8;margin-bottom:1.5rem;transition:background .3s;}
  .zk-step-line.done{background:#21d190;}

  /* ── PAYMENT ── */
  .payment-options{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.8rem;margin-bottom:1.2rem;}
  .pay-opt{border:2px solid #e8e8e8;border-radius:14px;padding:.9rem .6rem;text-align:center;cursor:pointer;transition:all .25s;}
  .pay-opt:hover{border-color:#ff416c;}
  .pay-opt.selected{border-color:#ff416c;background:#fff5f7;}
  .pay-opt .pay-icon{font-size:1.8rem;margin-bottom:.3rem;}
  .pay-opt .pay-label{font-size:.75rem;font-weight:700;color:#555;}
  .pay-details{display:none;margin-top:.8rem;}
  .pay-details.show{display:block;}

  /* ── ORDER TRACK ── */
  .tracker-timeline{position:relative;}
  .tracker-timeline::before{
    content:'';position:absolute;left:21px;top:0;bottom:0;
    width:2px;background:#e8e8e8;
  }
  .track-step{display:flex;gap:1rem;margin-bottom:1.4rem;position:relative;align-items:flex-start;}
  .track-icon{
    width:44px;height:44px;border-radius:50%;
    background:#f0f0f0;display:flex;align-items:center;justify-content:center;
    font-size:1.2rem;flex-shrink:0;border:3px solid #e8e8e8;
    position:relative;z-index:1;transition:all .4s;
  }
  .track-step.done .track-icon{background:#21d190;border-color:#21d190;}
  .track-step.active .track-icon{background:#ff416c;border-color:#ff416c;animation:tpulse 1.5s infinite;}
  @keyframes tpulse{0%,100%{box-shadow:0 0 0 0 rgba(255,65,108,.4)}50%{box-shadow:0 0 0 10px rgba(255,65,108,0)}}
  .track-info h4{font-size:.95rem;font-weight:800;margin-bottom:.15rem;}
  .track-info p{font-size:.8rem;color:#888;}
  .track-state{display:inline-block;padding:.2rem .7rem;border-radius:50px;font-size:.7rem;font-weight:700;margin-top:.3rem;}
  .track-state.done{background:#e8faf3;color:#21d190;}
  .track-state.active{background:#fff0f3;color:#ff416c;}
  .track-state.pending{background:#f5f5f5;color:#bbb;}
  .track-eta{
    background:linear-gradient(135deg,#1a1a2e,#302b63);
    border-radius:16px;padding:1.2rem 1.5rem;
    display:flex;align-items:center;justify-content:space-between;
    margin-top:1.5rem;color:#fff;flex-wrap:wrap;gap:.5rem;
  }
  .track-eta h4{font-size:.95rem;font-weight:800;}
  .track-eta p{font-size:.8rem;opacity:.7;}
  .track-eta .eta-date{font-size:1.1rem;font-weight:800;color:#ffd200;}

  /* ── ABOUT ── */
  .about-banner{
    background:linear-gradient(135deg,#ff416c,#a18cd1,#4facfe);
    background-size:200% 200%;animation:abShift 5s ease infinite;
    border-radius:18px;padding:2rem;text-align:center;color:#fff;margin-bottom:1.5rem;
  }
  @keyframes abShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
  .about-banner h3{font-family:'Bebas Neue',sans-serif;font-size:2.5rem;letter-spacing:2px;}
  .about-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.5rem;}
  .about-stat{text-align:center;background:#f8f9ff;border-radius:16px;padding:1.2rem .8rem;}
  .stat-num{font-size:1.6rem;font-weight:900;background:linear-gradient(135deg,#ff416c,#a18cd1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .about-stat p{font-size:.78rem;color:#666;margin-top:.3rem;font-weight:700;}
  .about-values{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;}
  .about-val-card{background:#f8f9ff;border-radius:14px;padding:1rem;}
  .about-val-card .vemoji{font-size:1.6rem;margin-bottom:.4rem;}
  .about-val-card h4{font-size:.88rem;font-weight:800;margin-bottom:.2rem;}
  .about-val-card p{font-size:.75rem;color:#777;line-height:1.5;}

  /* ── CONTACT ── */
  .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.4rem;}
  .contact-card{background:#f8f9ff;border-radius:14px;padding:1rem;display:flex;gap:.8rem;align-items:flex-start;}
  .contact-card .ci{font-size:1.5rem;flex-shrink:0;}
  .contact-card h4{font-size:.82rem;font-weight:800;margin-bottom:.15rem;}
  .contact-card p{font-size:.75rem;color:#777;line-height:1.4;}
  .social-row{display:flex;gap:.8rem;margin-bottom:1.4rem;}
  .soc-btn{flex:1;padding:.65rem;border-radius:12px;border:none;font-family:'Nunito',sans-serif;font-size:.8rem;font-weight:700;cursor:pointer;transition:all .25s;color:#fff;}
  .soc-btn:hover{transform:translateY(-2px);opacity:.9;}
  .s-insta{background:linear-gradient(135deg,#f09433,#dc2743,#bc1888);}
  .s-tiktok{background:#010101;}
  .s-yt{background:#ff0000;}
  .s-tw{background:#1da1f2;}

  /* ── ORDER SUMMARY ── */
  .order-summary{background:#f8f9ff;border-radius:16px;padding:1.2rem;margin-bottom:1.2rem;}
  .order-summary h4{font-size:.78rem;font-weight:800;color:#888;letter-spacing:1px;text-transform:uppercase;margin-bottom:.8rem;}
  .order-item-row{display:flex;justify-content:space-between;font-size:.88rem;padding:.35rem 0;border-bottom:1px dashed #e0e0e0;}
  .order-item-row:last-of-type{border:none;}
  .order-total-row{display:flex;justify-content:space-between;font-size:1rem;font-weight:800;margin-top:.8rem;color:#ff416c;}

  /* ── NOTIF BANNER ── */
  #zk-notif{
    position:fixed;bottom:1.5rem;right:1.5rem;z-index:800;
    background:#fff;border-radius:18px;
    box-shadow:0 12px 40px rgba(0,0,0,.15);
    padding:1rem 1.2rem;max-width:300px;
    display:flex;gap:.8rem;align-items:flex-start;
    transform:translateX(360px);transition:transform .5s cubic-bezier(.4,0,.2,1);
    border-left:4px solid #ff416c;
  }
  #zk-notif.show{transform:translateX(0);}
  .notif-icon{font-size:1.8rem;flex-shrink:0;}
  .notif-text h4{font-size:.85rem;font-weight:800;margin-bottom:.2rem;}
  .notif-text p{font-size:.75rem;color:#777;}
  #notif-x{position:absolute;top:.5rem;right:.6rem;background:none;border:none;color:#bbb;cursor:pointer;font-size:.85rem;}

  /* ── FAQ ── */
  .faq-item{border:1.5px solid #f0f0f0;border-radius:14px;margin-bottom:.8rem;overflow:hidden;}
  .faq-q{padding:1rem 1.2rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-weight:700;font-size:.92rem;}
  .faq-arrow{font-size:1rem;transition:transform .3s;}
  .faq-a{max-height:0;overflow:hidden;transition:max-height .35s ease;background:#f8f9ff;}
  .faq-a p{padding:.8rem 1.2rem;font-size:.85rem;color:#555;line-height:1.6;}

  /* ── SUCCESS BOX ── */
  .zk-success-box{text-align:center;padding:2rem 1rem;}
  .zk-success-box .big-emoji{font-size:4rem;margin-bottom:1rem;}
  .zk-success-box h3{font-size:1.4rem;font-weight:800;margin-bottom:.5rem;}
  .zk-success-box p{color:#777;font-size:.92rem;}

  /* ── MISC ── */
  .zk-divider{display:flex;align-items:center;gap:.8rem;margin:1rem 0;color:#bbb;font-size:.8rem;}
  .zk-divider::before,.zk-divider::after{content:'';flex:1;height:1px;background:#e8e8e8;}
  .tag-free{background:#e8faf3;color:#21d190;padding:.2rem .7rem;border-radius:50px;font-size:.72rem;font-weight:700;}

  @media(max-width:560px){
    .zk-row,.zk-row3,.payment-options,.about-stats,.about-values,.contact-grid{grid-template-columns:1fr;}
  }
  `;
  document.head.appendChild(s);
})();


/* ────────────────────────────────────────────────────────────────
   SECTION 1 — STATE
   ──────────────────────────────────────────────────────────────── */
let cart = [];
let wishlist = [];
let currentGender = "all";
let currentCat    = "all";
let currentSlide  = 0;
let sliderTimer   = null;
let currentUser   = null;   // { name, email, phone, avatar }
let simulatedOTP  = "";
let checkoutStep  = 1;
let checkoutData  = {};
let userCoords    = null;   // { lat, lng }
let leafletMap    = null;


/* ────────────────────────────────────────────────────────────────
   SECTION 2 — PRODUCT DATA
   ──────────────────────────────────────────────────────────────── */
const PRODUCTS = [
  {id:1,name:"Oversized Graphic Tee",brand:"STREETCORE",price:699,old:1499,img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",badge:"hot",cat:"clothing",gender:"men",emoji:"👕",desc:"100% Cotton. Dropped shoulders. Bold Y2K graphic print.",sizes:["S","M","L","XL","XXL"],rating:4.8,rv:2341},
  {id:2,name:"Floral Wrap Dress",brand:"BLOSSOMCO",price:1299,old:2499,img:"https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop",badge:"new",cat:"clothing",gender:"women",emoji:"👗",desc:"Flowy chiffon fabric. Perfect for day or night.",sizes:["XS","S","M","L"],rating:4.9,rv:1892},
  {id:3,name:"Cargo Wide-Leg Pants",brand:"URBANFIT",price:1799,old:3499,img:"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop",badge:"hot",cat:"clothing",gender:"men",emoji:"👖",desc:"6 pockets. Relaxed fit. Total street-ready vibe.",sizes:["28","30","32","34","36"],rating:4.7,rv:987},
  {id:4,name:"Kids Rainbow Hoodie",brand:"KIDSZAP",price:799,old:1299,img:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",badge:"new",cat:"clothing",gender:"kids",emoji:"🌈",desc:"Soft fleece. Bright rainbow print. Machine washable.",sizes:["3-4Y","5-6Y","7-8Y","9-10Y"],rating:4.9,rv:654},
  {id:5,name:"Satin Slip Co-Ord Set",brand:"GLOWFIT",price:2199,old:3999,img:"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop",badge:"sale",cat:"clothing",gender:"women",emoji:"✨",desc:"Satin finish. Crop top + wide pants. Total vibe.",sizes:["XS","S","M","L"],rating:4.6,rv:432},
  {id:6,name:"Classic Denim Jacket",brand:"DENIM CULT",price:2499,old:null,img:"https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=400&h=400&fit=crop",badge:"top",cat:"clothing",gender:"unisex",emoji:"🧥",desc:"Distressed wash. Unisex fit. An all-time classic.",sizes:["S","M","L","XL"],rating:4.8,rv:3201},
  {id:7,name:"Chunky Platform Sneakers",brand:"STRIDE CO.",price:3499,old:5999,img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",badge:"hot",cat:"shoes",gender:"unisex",emoji:"👟",desc:"4cm platform. Cloud cushion sole. Iconic colourway.",sizes:["36","37","38","39","40","41","42"],rating:4.9,rv:5678},
  {id:8,name:"Women's Block Heels",brand:"STILETTO",price:1899,old:3299,img:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop",badge:"new",cat:"shoes",gender:"women",emoji:"👠",desc:"Comfortable 5cm block heel. Faux suede upper.",sizes:["35","36","37","38","39","40"],rating:4.5,rv:789},
  {id:9,name:"Kids Light-Up Sneakers",brand:"KIDSTEP",price:999,old:1799,img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",badge:"new",cat:"shoes",gender:"kids",emoji:"✨",desc:"LED sole. Easy velcro strap. Kids absolutely love them!",sizes:["C8","C9","C10","C11","C12"],rating:5.0,rv:2134},
  {id:10,name:"Men's Premium Loafers",brand:"DAPPERCO",price:2299,old:4499,img:"https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&h=400&fit=crop",badge:"sale",cat:"shoes",gender:"men",emoji:"🥿",desc:"Premium faux leather. Slip-on comfort daily wear.",sizes:["39","40","41","42","43","44"],rating:4.6,rv:456},
  {id:11,name:"Chunky Gold Chain",brand:"METALHEAD",price:599,old:null,img:"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",badge:"hot",cat:"jewellery",gender:"unisex",emoji:"🔗",desc:"18K gold plated. Thick Cuban link. Major drip alert.",sizes:["One Size"],rating:4.8,rv:3412},
  {id:12,name:"Pearl Drop Earrings",brand:"SOFTGIRL",price:399,old:799,img:"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop",badge:"new",cat:"jewellery",gender:"women",emoji:"🤍",desc:"Freshwater pearl drop. Delicate gold tone hook.",sizes:["One Size"],rating:4.9,rv:2876},
  {id:13,name:"Crystal Stacking Rings",brand:"GLOW CO.",price:299,old:599,img:"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop",badge:"sale",cat:"jewellery",gender:"women",emoji:"💍",desc:"Set of 5 adjustable rings. Mix & match crystals.",sizes:["Adjustable"],rating:4.7,rv:1654},
  {id:14,name:"Kids Charm Bracelet",brand:"KIDSZAP",price:249,old:499,img:"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",badge:"new",cat:"jewellery",gender:"kids",emoji:"🌟",desc:"Colourful charms. Hypoallergenic silver. Super cute!",sizes:["One Size"],rating:4.8,rv:543},
  {id:15,name:"Neon Bluetooth Earbuds",brand:"SOUNDZAP",price:1299,old:2999,img:"https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",badge:"hot",cat:"electronics",gender:"unisex",emoji:"🎧",desc:"30hr battery. Active noise cancel. Gen Z colourway.",sizes:["One Size"],rating:4.7,rv:4321},
  {id:16,name:"Smart Watch Neon Edition",brand:"TECHZAP",price:2999,old:5999,img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",badge:"new",cat:"electronics",gender:"unisex",emoji:"⌚",desc:"Health tracking. 100+ watch faces. Waterproof IP68.",sizes:["One Size"],rating:4.6,rv:2109},
  {id:17,name:"Luxury Perfume Gift Set",brand:"ESSENCE",price:1799,old:2999,img:"https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&h=400&fit=crop",badge:"top",cat:"beauty",gender:"unisex",emoji:"🌸",desc:"3 full-size fragrances. Long lasting 24hr scent.",sizes:["One Size"],rating:4.9,rv:1234},
  {id:18,name:"Pro Makeup Palette",brand:"GLOWUP",price:899,old:1599,img:"https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop",badge:"sale",cat:"beauty",gender:"women",emoji:"💄",desc:"18 shades. Matte & shimmer. Vegan & cruelty-free.",sizes:["One Size"],rating:4.8,rv:3456},
];

const ORDER_DB = {
  "ZAP100001":{ product:"Chunky Platform Sneakers", placed:"25 Mar 2025", eta:"5 Apr 2025", currentStep:3,
    steps:[
      {icon:"📋",label:"Order Placed",state:"Mumbai, MH",time:"25 Mar · 10:42 AM"},
      {icon:"✅",label:"Order Confirmed",state:"Mumbai Warehouse, MH",time:"25 Mar · 12:15 PM"},
      {icon:"📦",label:"Packed & Ready",state:"Mumbai Hub, MH",time:"26 Mar · 09:00 AM"},
      {icon:"🚚",label:"Shipped",state:"Pune Transit, MH",time:"27 Mar · 06:30 AM"},
      {icon:"🛵",label:"Out for Delivery",state:"Kothrud, Pune",time:"—"},
      {icon:"🎉",label:"Delivered",state:"Your Doorstep",time:"—"},
    ]},
  "ZAP100002":{ product:"Floral Wrap Dress", placed:"30 Mar 2025", eta:"3 Apr 2025", currentStep:5,
    steps:[
      {icon:"📋",label:"Order Placed",state:"Delhi, DL",time:"30 Mar · 2:00 PM"},
      {icon:"✅",label:"Order Confirmed",state:"Delhi Warehouse, DL",time:"30 Mar · 3:30 PM"},
      {icon:"📦",label:"Packed & Ready",state:"Delhi Hub, DL",time:"31 Mar · 10:00 AM"},
      {icon:"🚚",label:"Shipped",state:"Delhi NCR, DL",time:"1 Apr · 08:00 AM"},
      {icon:"🛵",label:"Out for Delivery",state:"Connaught Place, DL",time:"3 Apr · 09:15 AM"},
      {icon:"🎉",label:"Delivered",state:"Your Doorstep",time:"3 Apr · 12:45 PM"},
    ]},
};

const FAQS = [
  {q:"How long does delivery take?",a:"Metro cities: 1–2 days. Tier 2 cities: 3–5 days. Remote areas: 5–7 days. Express delivery available at checkout."},
  {q:"Can I return a product?",a:"Yes! Hassle-free returns within 30 days. Products must be unused with original tags attached."},
  {q:"Is Cash on Delivery (COD) available?",a:"COD is available for orders up to ₹10,000. A convenience fee of ₹49 applies."},
  {q:"How do I track my order?",a:"Click 'Track Order' in the footer and enter your Order ID (sent via email after purchase)."},
  {q:"Are the products authentic?",a:"100% yes. Every brand and seller is verified on our platform. Zero tolerance for fakes."},
  {q:"What payment methods are accepted?",a:"Credit/Debit cards, UPI (Paytm, GPay, PhonePe), Net Banking, and COD."},
  {q:"How do I cancel an order?",a:"Cancel within 24 hours via My Orders → Cancel Order. After 24 hrs, use Returns."},
];


/* ────────────────────────────────────────────────────────────────
   SECTION 3 — UTILITIES
   ──────────────────────────────────────────────────────────────── */
const fmt = n => Number(n).toLocaleString("en-IN");

function showToast(msg, type = "success") {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.style.background = type === "wish"
    ? "linear-gradient(135deg,#fc5c7d,#6a3093)"
    : "linear-gradient(135deg,#21d190,#4facfe)";
  t.classList.add("show");
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove("show"), 2800);
}

function scrollToProducts() {
  document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
}

function createModal(id, wide = false) {
  document.getElementById(id)?.remove();
  const bd = document.createElement("div");
  bd.className = "zk-backdrop"; bd.id = id;
  const m  = document.createElement("div");
  m.className = "zk-modal" + (wide ? " zk-modal-wide" : "");
  bd.appendChild(m); document.body.appendChild(bd);
  bd.addEventListener("click", e => { if (e.target === bd) closeModal(id); });
  document.addEventListener("keydown", function esc(e) {
    if (e.key === "Escape") { closeModal(id); document.removeEventListener("keydown", esc); }
  });
  requestAnimationFrame(() => bd.classList.add("open"));
  return { bd, m };
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("open");
  setTimeout(() => el.remove(), 380);
}

const closeBtnHTML = id =>
  `<button class="zk-close-btn" onclick="closeModal('${id}')">✕</button>`;


/* ────────────────────────────────────────────────────────────────
   SECTION 4 — LOGIN GATE
   ──────────────────────────────────────────────────────────────── */
function buildLoginGate() {
  const gate = document.createElement("div");
  gate.id = "zk-login-gate";
  gate.innerHTML = `
    <div class="gate-box">
      <div class="gate-header">
        <div class="gate-logo">ZAPKART</div>
        <p>India's most Gen Z shopping destination 🛍️</p>
      </div>
      <div class="gate-body">
        <div class="gate-tabs">
          <button class="gate-tab active" onclick="switchGateTab('google',this)">🔵 Google</button>
          <button class="gate-tab" onclick="switchGateTab('otp',this)">📱 Mobile OTP</button>
        </div>

        <!-- GOOGLE PANEL -->
        <div class="gate-panel show" id="gate-google">
          <button class="google-btn" onclick="startGoogleLogin()">
            <svg class="google-icon" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.2 33.7 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6-6C34.5 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z"/>
              <path fill="#34A853" d="M6.3 14.7l7 5.1C15 16.2 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6-6C34.5 6.1 29.6 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z"/>
              <path fill="#FBBC05" d="M24 44c5.6 0 10.4-1.8 14.1-5L31.5 33c-2 1.4-4.6 2.2-7.5 2.2-5.7 0-10.5-3.8-12.2-9l-7 5.3C8.2 39.1 15.5 44 24 44z"/>
              <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-.8 2.2-2.3 4-4.2 5.3l6.6 5.1C41.5 35.8 44 30.2 44 24c0-1.3-.1-2.7-.5-4z"/>
            </svg>
            Continue with Google
          </button>
          <div id="gate-google-fields" style="display:none">
            <input class="gate-input" id="g-name"  placeholder="Your Name" type="text"/>
            <input class="gate-input" id="g-email" placeholder="Gmail address" type="email"/>
            <span class="gate-error" id="g-err">Please enter a valid Gmail address.</span>
            <button class="gate-btn" onclick="submitGoogleLogin()">✅ Sign In with Google</button>
          </div>
        </div>

        <!-- OTP PANEL -->
        <div class="gate-panel" id="gate-otp">
          <div id="otp-step1">
            <label class="zk-label" style="display:block;margin-bottom:.5rem;font-size:.8rem;font-weight:800;color:#666;text-transform:uppercase;letter-spacing:.8px">Mobile Number</label>
            <div style="display:flex;gap:.6rem;margin-bottom:1rem">
              <select class="gate-input" style="width:90px;flex-shrink:0">
                <option>🇮🇳 +91</option><option>🇺🇸 +1</option><option>🇬🇧 +44</option>
              </select>
              <input class="gate-input" id="otp-phone" placeholder="Enter 10-digit number" type="tel" maxlength="10" style="margin:0"/>
            </div>
            <span class="gate-error" id="otp-phone-err">Please enter a valid 10-digit mobile number.</span>
            <button class="gate-btn" onclick="sendOTP()">📲 Send OTP</button>
          </div>

          <div id="otp-step2" style="display:none;text-align:center">
            <p class="gate-success-msg" id="otp-sent-msg"></p>
            <p style="font-size:.82rem;color:#666;margin-bottom:1rem">Enter the 6-digit OTP sent to your number</p>
            <div class="otp-row">
              <input class="otp-digit" maxlength="1" type="tel" oninput="otpMove(this,0)"/>
              <input class="otp-digit" maxlength="1" type="tel" oninput="otpMove(this,1)"/>
              <input class="otp-digit" maxlength="1" type="tel" oninput="otpMove(this,2)"/>
              <input class="otp-digit" maxlength="1" type="tel" oninput="otpMove(this,3)"/>
              <input class="otp-digit" maxlength="1" type="tel" oninput="otpMove(this,4)"/>
              <input class="otp-digit" maxlength="1" type="tel" oninput="otpMove(this,5)"/>
            </div>
            <span class="gate-error" id="otp-verify-err">Incorrect OTP. Please try again.</span>
            <button class="gate-btn" onclick="verifyOTP()">🔐 Verify OTP</button>
            <button class="gate-btn secondary" onclick="resendOTP()">Resend OTP</button>
          </div>
        </div>

      </div>
    </div>`;
  document.body.appendChild(gate);
}

function switchGateTab(tab, btn) {
  document.querySelectorAll(".gate-tab").forEach(t => t.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".gate-panel").forEach(p => p.classList.remove("show"));
  document.getElementById("gate-" + tab).classList.add("show");
}

/* ── Google Login ── */
function startGoogleLogin() {
  document.getElementById("gate-google-fields").style.display = "block";
}
function submitGoogleLogin() {
  const name  = document.getElementById("g-name")?.value.trim();
  const email = document.getElementById("g-email")?.value.trim();
  const errEl = document.getElementById("g-err");
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk || !name) { errEl.classList.add("show"); return; }
  errEl.classList.remove("show");
  const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2);
  completeLogin({ name, email, phone: "", avatar: initials });
}

/* ── Mobile OTP ── */
function sendOTP() {
  const phone = document.getElementById("otp-phone")?.value.trim();
  const errEl = document.getElementById("otp-phone-err");
  if (!/^[6-9]\d{9}$/.test(phone)) { errEl.classList.add("show"); return; }
  errEl.classList.remove("show");
  simulatedOTP = String(Math.floor(100000 + Math.random() * 900000));
  // Show OTP in a visible banner (simulates SMS)
  document.getElementById("otp-sent-msg").textContent =
    `✅ OTP sent to +91 ${phone} — Demo OTP: ${simulatedOTP}`;
  document.getElementById("otp-step1").style.display = "none";
  document.getElementById("otp-step2").style.display = "block";
}
function resendOTP() {
  simulatedOTP = String(Math.floor(100000 + Math.random() * 900000));
  document.getElementById("otp-sent-msg").textContent =
    `🔄 New OTP: ${simulatedOTP}`;
  document.querySelectorAll(".otp-digit").forEach(i => i.value = "");
  document.querySelectorAll(".otp-digit")[0].focus();
}
function otpMove(input, idx) {
  if (input.value.length === 1) {
    const next = document.querySelectorAll(".otp-digit")[idx + 1];
    if (next) next.focus();
  }
}
function verifyOTP() {
  const entered = [...document.querySelectorAll(".otp-digit")].map(i => i.value).join("");
  const errEl = document.getElementById("otp-verify-err");
  if (entered !== simulatedOTP) { errEl.classList.add("show"); return; }
  errEl.classList.remove("show");
  const phone = document.getElementById("otp-phone")?.value.trim();
  completeLogin({ name: "User " + phone.slice(-4), email: "", phone, avatar: "👤" });
}

/* ── After successful login ── */
function completeLogin(user) {
  currentUser = user;
  // Slide out gate
  const gate = document.getElementById("zk-login-gate");
  gate.classList.add("hide");
  setTimeout(() => gate.remove(), 700);
  // Show user bar in nav
  buildUserBar(user);
  // Ask for location
  requestLocation();
  // Start notifications after 6 sec
  setTimeout(() => { showNotif(); setInterval(showNotif, 30000); }, 6000);
  showToast(`🎉 Welcome, ${user.name}!`);
}

function buildUserBar(user) {
  let bar = document.getElementById("zk-user-bar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "zk-user-bar";
    bar.className = "gate-user-bar";
    document.body.appendChild(bar);
  }
  bar.innerHTML = `
    <div class="user-avatar">${user.avatar.length <= 2 ? user.avatar : "👤"}</div>
    <span class="user-name">${user.name}</span>
    <button class="logout-btn" onclick="doLogout()">Logout</button>`;
  bar.classList.add("show");
}

function doLogout() {
  currentUser = null;
  document.getElementById("zk-user-bar")?.remove();
  buildLoginGate();  // Show gate again
}


/* ────────────────────────────────────────────────────────────────
   SECTION 5 — GEOLOCATION + MAP
   ──────────────────────────────────────────────────────────────── */
function requestLocation() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    pos => {
      userCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    },
    () => {
      // Fallback: default to Pune, MH
      userCoords = { lat: 18.5204, lng: 73.8567 };
    }
  );
}

/* Load Leaflet.js dynamically (free, no API key) */
function loadLeaflet(callback) {
  if (window.L) { callback(); return; }
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  document.head.appendChild(link);
  const script = document.createElement("script");
  script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
  script.onload = callback;
  document.head.appendChild(script);
}

function buildDeliveryMap(containerId, userLat, userLng, warehouseLat, warehouseLng) {
  // Destroy previous instance
  if (leafletMap) { leafletMap.remove(); leafletMap = null; }

  const map = L.map(containerId, { zoomControl: true }).setView([userLat, userLng], 12);
  leafletMap = map;

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
    maxZoom: 18,
  }).addTo(map);

  // User marker (home)
  const homeIcon = L.divIcon({
    html: `<div style="font-size:28px;line-height:1">🏠</div>`,
    iconSize: [36, 36], iconAnchor: [18, 36], className: ""
  });
  L.marker([userLat, userLng], { icon: homeIcon })
    .addTo(map)
    .bindPopup("<b>Your Delivery Address</b>")
    .openPopup();

  // Warehouse marker
  const whIcon = L.divIcon({
    html: `<div style="font-size:28px;line-height:1">🏭</div>`,
    iconSize: [36, 36], iconAnchor: [18, 36], className: ""
  });
  L.marker([warehouseLat, warehouseLng], { icon: whIcon })
    .addTo(map)
    .bindPopup("<b>ZAPKART Warehouse</b><br/>Dispatching your order");

  // Delivery agent (midpoint + slight offset)
  const midLat = (userLat + warehouseLat) / 2 + 0.01;
  const midLng = (userLng + warehouseLng) / 2 + 0.01;
  const agentIcon = L.divIcon({
    html: `<div style="font-size:28px;line-height:1;animation:bounce 1s infinite alternate">🛵</div>`,
    iconSize: [36, 36], iconAnchor: [18, 36], className: ""
  });
  L.marker([midLat, midLng], { icon: agentIcon })
    .addTo(map)
    .bindPopup("<b>Delivery Agent</b><br/>On the way to you!");

  // Route polyline
  L.polyline(
    [[warehouseLat, warehouseLng], [midLat, midLng], [userLat, userLng]],
    { color: "#ff416c", weight: 4, dashArray: "8 6", opacity: .8 }
  ).addTo(map);

  // Fit bounds
  map.fitBounds([
    [Math.min(userLat, warehouseLat) - 0.02, Math.min(userLng, warehouseLng) - 0.02],
    [Math.max(userLat, warehouseLat) + 0.02, Math.max(userLng, warehouseLng) + 0.02],
  ]);
}


/* ────────────────────────────────────────────────────────────────
   SECTION 6 — PRODUCT CARDS + GRID RENDERING
   ──────────────────────────────────────────────────────────────── */
function makeCard(p) {
  const off   = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
  const stars = "★".repeat(Math.round(p.rating)) + "☆".repeat(5 - Math.round(p.rating));
  const szHtml = p.sizes.slice(0, 5)
    .map(s => `<span class="sz" onclick="selSz(this)">${s}</span>`).join("");
  const wished = wishlist.includes(p.id);
  return `
  <div class="flip-wrap sa">
    <div class="flip-card">
      <div class="card-front">
        <div class="cf-img">
          <img src="${p.img}" alt="${p.name}" loading="lazy"/>
          <span class="cf-badge b-${p.badge}">
            ${p.badge==="hot"?"🔥 HOT":p.badge==="new"?"✨ NEW":p.badge==="sale"?"🏷️ SALE":"⭐ TOP"}
          </span>
          <button class="cf-fav ${wished?"liked":""}" onclick="toggleWish(this,${p.id})">
            ${wished?"♥":"♡"}
          </button>
        </div>
        <div class="cf-body">
          <div class="cf-brand">${p.brand}</div>
          <div class="cf-name">${p.name}</div>
          <div class="cf-row">
            <div>
              <span class="cf-price">₹${fmt(p.price)}</span>
              ${p.old?`<span class="cf-old">₹${fmt(p.old)}</span><span class="cf-off">${off}% off</span>`:""}
            </div>
            <div><span class="cf-stars">${stars}</span><span class="cf-rcount">(${fmt(p.rv)})</span></div>
          </div>
        </div>
      </div>
      <div class="card-back">
        <div class="back-emoji">${p.emoji}</div>
        <div class="back-name">${p.name}</div>
        <div class="back-price">₹${fmt(p.price)}</div>
        <div class="back-desc">${p.desc}</div>
        <div class="back-sizes">${szHtml}</div>
        <div class="back-btns">
          <button class="btn-cb btn-add" onclick="addToCart(${p.id},event)">🛒 Add to Cart</button>
          <button class="btn-cb btn-wish" onclick="quickWish(${p.id},event)">♡ Wish</button>
        </div>
      </div>
    </div>
  </div>`;
}

function renderGrid(id, data) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = data.length
    ? data.map(makeCard).join("")
    : `<p style="color:#aaa;padding:2rem;grid-column:1/-1">No products found.</p>`;
  observeSA();
}

function renderAll() {
  let d = PRODUCTS;
  if (currentGender !== "all") d = d.filter(p => p.gender === currentGender || p.gender === "unisex");
  if (currentCat    !== "all") d = d.filter(p => p.cat    === currentCat);
  renderGrid("products-grid",  d.slice(0, 8));
  renderGrid("jewellery-grid", PRODUCTS.filter(p => p.cat === "jewellery").slice(0, 4));
  renderGrid("shoes-grid",     PRODUCTS.filter(p => p.cat === "shoes").slice(0, 4));
  renderGrid("elec-grid",      PRODUCTS.filter(p => p.cat === "electronics").slice(0, 4));
}


/* ────────────────────────────────────────────────────────────────
   SECTION 7 — FILTERS + SEARCH
   ──────────────────────────────────────────────────────────────── */
function filterGender(g, el) {
  currentGender = g;
  document.querySelectorAll(".g-tab").forEach(t => t.classList.remove("active"));
  if (el) el.classList.add("active");
  renderAll(); scrollToProducts();
}
function filterCat(c) {
  currentCat = c; currentGender = "all";
  document.querySelectorAll(".g-tab").forEach(t => t.classList.remove("active"));
  document.querySelector(".g-tab.all")?.classList.add("active");
  renderAll(); scrollToProducts();
}
function setMainCat(el, c) {
  document.querySelectorAll(".cat-tab").forEach(t => t.classList.remove("active"));
  el.classList.add("active"); currentCat = c;
  renderAll(); if (c !== "all") scrollToProducts();
}
function setTrend(el) {
  document.querySelectorAll(".trend-chip").forEach(c => c.classList.remove("active"));
  el.classList.add("active");
  showToast(`🔥 ${el.textContent.trim()}`);
}
function liveSearch(q) {
  if (!q.trim()) { renderAll(); return; }
  const r = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.brand.toLowerCase().includes(q.toLowerCase()) ||
    p.cat.toLowerCase().includes(q.toLowerCase())
  );
  renderGrid("products-grid", r); scrollToProducts();
}
function doSearch() { liveSearch(document.getElementById("search-input")?.value || ""); }
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    const inp = document.getElementById("search-input");
    if (inp) { inp.value = ""; renderAll(); }
  }
});


/* ────────────────────────────────────────────────────────────────
   SECTION 8 — CART
   ──────────────────────────────────────────────────────────────── */
function addToCart(id, e) {
  if (e) e.stopPropagation();
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const ex = cart.find(x => x.id === id);
  if (ex) ex.qty++; else cart.push({ ...p, qty: 1 });
  refreshCartUI(); showToast(`✅ ${p.name} added!`); openCart();
}
function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  refreshCartUI();
}
function changeQty(id, d) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += d;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  refreshCartUI();
}
function refreshCartUI() {
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = cart.reduce((s, x) => s + x.qty, 0);
  const con  = document.getElementById("cart-items-container");
  const foot = document.getElementById("cart-footer");
  if (!con || !foot) return;
  if (!cart.length) {
    con.innerHTML = `<div class="cs-empty"><div class="cs-empty-emoji">🛒</div>
      <p style="font-weight:700;font-size:1rem;margin-bottom:.5rem">Your cart is empty!</p>
      <p style="font-size:.85rem">Add items to get started 🔥</p></div>`;
    foot.style.display = "none"; return;
  }
  con.innerHTML = cart.map(i => `
    <div class="cs-item">
      <img src="${i.img}" alt="${i.name}"/>
      <div class="cs-item-info">
        <h4>${i.name}</h4><p>₹${fmt(i.price)}</p>
        <div class="cs-item-qty">
          <button class="qty-btn" onclick="changeQty(${i.id},-1)">−</button>
          <span class="qty-num">${i.qty}</span>
          <button class="qty-btn" onclick="changeQty(${i.id},+1)">+</button>
        </div>
      </div>
      <button class="cs-remove" onclick="removeFromCart(${i.id})">✕</button>
    </div>`).join("");
  const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const el = document.getElementById("cart-total");
  if (el) el.textContent = "₹" + fmt(total);
  foot.style.display = "block";
}
function openCart()  { document.getElementById("cart-sidebar")?.classList.add("open"); document.getElementById("overlay")?.classList.add("on"); }
function closeCart() { document.getElementById("cart-sidebar")?.classList.remove("open"); document.getElementById("overlay")?.classList.remove("on"); }


/* ────────────────────────────────────────────────────────────────
   SECTION 9 — WISHLIST
   ──────────────────────────────────────────────────────────────── */
function toggleWish(btn, id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(x => x !== id);
    btn.classList.remove("liked"); btn.textContent = "♡";
    showToast("💔 Removed from Wishlist");
  } else {
    wishlist.push(id);
    btn.classList.add("liked"); btn.textContent = "♥";
    showToast("💖 Added to Wishlist!", "wish");
  }
}
// legacy aliases used in HTML
function toggleFav(btn) { toggleWish(btn, -1); }
function quickWish(id, e) {
  if (e) e.stopPropagation();
  if (!wishlist.includes(id)) { wishlist.push(id); showToast("💖 Added to Wishlist!", "wish"); }
  else showToast("💖 Already in Wishlist!");
}
function addWish(e) { if (e) e.stopPropagation(); showToast("💖 Added to Wishlist!", "wish"); }
function selSz(el) {
  el.closest(".back-sizes").querySelectorAll(".sz").forEach(s => s.classList.remove("selected"));
  el.classList.add("selected");
}


/* ────────────────────────────────────────────────────────────────
   SECTION 10 — HERO SLIDER + COUNTDOWN
   ──────────────────────────────────────────────────────────────── */
function goSlide(n) {
  currentSlide = n;
  const track = document.getElementById("hero-slides");
  if (track) track.style.transform = `translateX(-${n * 100}%)`;
  document.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("active", i === n));
}
function startSlider() {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(() => goSlide((currentSlide + 1) % 4), 4000);
}
let totalSecs = 5 * 3600 + 30 * 60;
function startCountdown() {
  setInterval(() => {
    totalSecs--; if (totalSecs < 0) totalSecs = 5 * 3600;
    const h = Math.floor(totalSecs / 3600), m = Math.floor((totalSecs % 3600) / 60), s = totalSecs % 60;
    const th = document.getElementById("th"), tm = document.getElementById("tm"), ts = document.getElementById("ts");
    if (th) th.textContent = String(h).padStart(2, "0");
    if (tm) tm.textContent = String(m).padStart(2, "0");
    if (ts) ts.textContent = String(s).padStart(2, "0");
  }, 1000);
}
function observeSA() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vis"); obs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll(".sa:not(.vis)").forEach(el => obs.observe(el));
}


/* ────────────────────────────────────────────────────────────────
   SECTION 11 — ABOUT US
   ──────────────────────────────────────────────────────────────── */
function openAboutUs() {
  const { m } = createModal("modal-about");
  m.innerHTML = `
    <div class="zk-head"><h2>🏬 About ZAPKART</h2>${closeBtnHTML("modal-about")}</div>
    <div class="zk-body">
      <div class="about-banner">
        <div style="font-size:3rem">🛍️</div>
        <h3>SHOP BOLD. LIVE BOLDER.</h3>
        <p>India's most Gen Z friendly shopping destination — launched 2022</p>
      </div>
      <p style="color:#555;font-size:.92rem;line-height:1.7;margin-bottom:1.5rem">
        ZAPKART was born from one idea: fashion should be <strong>fun, affordable and guilt-free</strong>.
        We curate the hottest drops in clothing, shoes, jewellery, electronics & beauty —
        so you never settle for basic. 10L+ happy customers and growing. 🚀
      </p>
      <div class="about-stats">
        <div class="about-stat"><div class="stat-num">10L+</div><p>Happy Customers</p></div>
        <div class="about-stat"><div class="stat-num">50K+</div><p>Products Listed</p></div>
        <div class="about-stat"><div class="stat-num">500+</div><p>Partner Brands</p></div>
      </div>
      <h3 style="font-size:1rem;font-weight:800;margin-bottom:1rem">Our Values</h3>
      <div class="about-values">
        <div class="about-val-card"><div class="vemoji">💯</div><h4>Authenticity</h4><p>Every product is verified. No fakes, ever.</p></div>
        <div class="about-val-card"><div class="vemoji">⚡</div><h4>Speed</h4><p>Express delivery 24–48 hrs in metro cities.</p></div>
        <div class="about-val-card"><div class="vemoji">🌱</div><h4>Sustainability</h4><p>Eco-friendly packaging on 80% of orders.</p></div>
        <div class="about-val-card"><div class="vemoji">🤝</div><h4>Community</h4><p>Built by Gen Z, for Gen Z. Your voice shapes us.</p></div>
      </div>
    </div>`;
}


/* ────────────────────────────────────────────────────────────────
   SECTION 12 — TRACK ORDER (with map)
   ──────────────────────────────────────────────────────────────── */
function openTrackOrder() {
  const { m } = createModal("modal-track", true);
  m.innerHTML = `
    <div class="zk-head"><h2>📦 Track My Order</h2>${closeBtnHTML("modal-track")}</div>
    <div class="zk-body">
      <p style="color:#666;font-size:.88rem;margin-bottom:1rem">Enter your Order ID from your confirmation email.</p>
      <div style="display:flex;gap:.8rem;margin-bottom:1rem">
        <input class="zk-input" id="track-inp" placeholder="e.g. ZAP100001 or ZAP100002"
               type="text" onkeydown="if(event.key==='Enter')trackOrder()"/>
        <button class="zk-btn" style="width:auto;padding:.72rem 1.5rem" onclick="trackOrder()">🔍 Track</button>
      </div>
      <div id="track-result"></div>
      <div style="margin-top:1.2rem;background:#f8f9ff;border-radius:14px;padding:1rem">
        <p style="font-size:.78rem;font-weight:700;color:#888;margin-bottom:.6rem">🧪 Demo Order IDs:</p>
        <div style="display:flex;gap:.6rem;flex-wrap:wrap">
          <span onclick="document.getElementById('track-inp').value='ZAP100001';trackOrder()"
            style="padding:.3rem .9rem;background:linear-gradient(135deg,#ff416c,#a18cd1);color:#fff;border-radius:50px;font-size:.78rem;font-weight:700;cursor:pointer">
            ZAP100001 — In Transit 🚚
          </span>
          <span onclick="document.getElementById('track-inp').value='ZAP100002';trackOrder()"
            style="padding:.3rem .9rem;background:linear-gradient(135deg,#21d190,#4facfe);color:#fff;border-radius:50px;font-size:.78rem;font-weight:700;cursor:pointer">
            ZAP100002 — Delivered ✅
          </span>
        </div>
      </div>
    </div>`;
}

function trackOrder() {
  const id  = (document.getElementById("track-inp")?.value || "").trim().toUpperCase();
  const out = document.getElementById("track-result");
  if (!out) return;
  if (!id) { out.innerHTML = `<p style="color:#ff416c;font-weight:700">⚠️ Please enter an Order ID.</p>`; return; }

  const order = ORDER_DB[id];
  if (!order) {
    out.innerHTML = `<div style="text-align:center;padding:2rem;background:#fff5f5;border-radius:16px;margin-top:.5rem">
      <div style="font-size:3rem">🔍</div>
      <h3 style="font-size:1rem;margin:.5rem 0;font-weight:800">Order Not Found</h3>
      <p style="font-size:.85rem;color:#888">Check your order ID in your confirmation email.</p></div>`;
    return;
  }

  const stepsHTML = order.steps.map((s, i) => {
    const cls = i < order.currentStep ? "done" : i === order.currentStep ? "active" : "";
    return `<div class="track-step ${cls}">
      <div class="track-icon">${s.icon}</div>
      <div class="track-info">
        <h4>${s.label}</h4>
        <p>${s.time !== "—" ? s.time : "Pending"}</p>
        <span class="track-state ${cls}">📍 ${s.state}</span>
      </div></div>`;
  }).join("");

  const isDelivered = order.currentStep >= order.steps.length - 1;
  const coords = userCoords || { lat: 18.5204, lng: 73.8567 };
  const warehouseLat = coords.lat + 0.08, warehouseLng = coords.lng + 0.12;

  out.innerHTML = `
    <div style="background:#f0fff8;border-radius:14px;padding:1rem 1.2rem;margin-bottom:1.2rem;
         display:flex;justify-content:space-between;flex-wrap:wrap;gap:.5rem">
      <div><p style="font-size:.72rem;color:#888;font-weight:700;text-transform:uppercase">Order ID</p>
           <p style="font-weight:800">${id}</p></div>
      <div><p style="font-size:.72rem;color:#888;font-weight:700;text-transform:uppercase">Product</p>
           <p style="font-weight:800">${order.product}</p></div>
      <div><p style="font-size:.72rem;color:#888;font-weight:700;text-transform:uppercase">Placed On</p>
           <p style="font-weight:800">${order.placed}</p></div>
    </div>

    <!-- LIVE MAP -->
    <p style="font-size:.82rem;font-weight:800;color:#333;margin-bottom:.5rem">📍 Live Delivery Map</p>
    <div id="zk-map"></div>

    <div class="loc-info-bar">
      <span class="loc-icon">📡</span>
      <div>
        <strong>Tracking location</strong>
        <span>${coords.lat.toFixed(4)}°N, ${coords.lng.toFixed(4)}°E — ${isDelivered ? "Delivered" : "In Transit"}</span>
      </div>
    </div>

    <div class="tracker-timeline">${stepsHTML}</div>

    <div class="track-eta">
      <div>
        <h4>${isDelivered ? "✅ Delivered!" : "⏱️ Estimated Delivery"}</h4>
        <p>${isDelivered ? "Your order has been delivered." : "Based on current logistics"}</p>
      </div>
      <div class="eta-date">${order.eta}</div>
    </div>`;

  // Render map after HTML is inserted
  loadLeaflet(() => {
    setTimeout(() => buildDeliveryMap("zk-map", coords.lat, coords.lng, warehouseLat, warehouseLng), 100);
  });
}


/* ────────────────────────────────────────────────────────────────
   SECTION 13 — CHECKOUT (3 steps: Address → Payment → Confirm)
   ──────────────────────────────────────────────────────────────── */
function openCheckout() {
  if (!cart.length) { showToast("⚠️ Your cart is empty!"); return; }
  closeCart();
  checkoutStep = 1; checkoutData = {};
  const { m } = createModal("modal-co", true);
  renderCoStep(m);
}

function renderCoStep(m) {
  if (!m) m = document.querySelector("#modal-co .zk-modal");
  if (!m) return;

  const stepNames  = ["Delivery Address", "Payment", "Confirmation"];
  const stepIcons  = ["📍", "💳", "🎉"];

  let stepper = '<div class="zk-stepper">';
  for (let i = 1; i <= 3; i++) {
    const cls = i < checkoutStep ? "done" : i === checkoutStep ? "active" : "";
    stepper += `<div class="zk-step ${cls}">
      <div class="zk-step-circle">${i < checkoutStep ? "✓" : i}</div>
      <div class="zk-step-label">${stepNames[i-1]}</div></div>`;
    if (i < 3) stepper += `<div class="zk-step-line ${i < checkoutStep ? "done" : ""}"></div>`;
  }
  stepper += "</div>";

  const total = cart.reduce((s, x) => s + x.price * x.qty, 0);

  /* STEP 1 — ADDRESS */
  if (checkoutStep === 1) {
    m.innerHTML = `
      <div class="zk-head"><h2>📍 Delivery Address</h2>${closeBtnHTML("modal-co")}</div>
      <div class="zk-body">${stepper}
        <div class="zk-row">
          <div class="zk-field"><label class="zk-label">Full Name *</label>
            <input class="zk-input" id="co-name" placeholder="Arjun Mehta"
                   value="${checkoutData.name||''}" type="text"/>
            <span class="zk-error" id="co-name-err">Name required.</span></div>
          <div class="zk-field"><label class="zk-label">Phone *</label>
            <input class="zk-input" id="co-phone" placeholder="98XXXXXXXX"
                   value="${checkoutData.phone||''}" type="tel" maxlength="10"/>
            <span class="zk-error" id="co-phone-err">Valid 10-digit number needed.</span></div>
        </div>
        <div class="zk-field"><label class="zk-label">Email *</label>
          <input class="zk-input" id="co-email" placeholder="arjun@email.com"
                 value="${checkoutData.email||''}" type="email"/>
          <span class="zk-error" id="co-email-err">Valid email required.</span></div>
        <div class="zk-field"><label class="zk-label">House / Flat / Street *</label>
          <input class="zk-input" id="co-addr" placeholder="Flat 4B, Sunshine Apt, MG Road"
                 value="${checkoutData.addr||''}"/>
          <span class="zk-error" id="co-addr-err">Address required.</span></div>
        <div class="zk-row3">
          <div class="zk-field"><label class="zk-label">City *</label>
            <input class="zk-input" id="co-city" placeholder="Pune" value="${checkoutData.city||''}"/>
            <span class="zk-error" id="co-city-err">City required.</span></div>
          <div class="zk-field"><label class="zk-label">State *</label>
            <select class="zk-select" id="co-state">
              <option value="">Select State</option>
              ${["Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana",
                 "Karnataka","Kerala","Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan",
                 "Tamil Nadu","Telangana","Uttar Pradesh","Uttarakhand","West Bengal"]
                .map(st=>`<option ${checkoutData.state===st?"selected":""}>${st}</option>`).join("")}
            </select>
            <span class="zk-error" id="co-state-err">State required.</span></div>
          <div class="zk-field"><label class="zk-label">PIN Code *</label>
            <input class="zk-input" id="co-pin" placeholder="411001"
                   value="${checkoutData.pin||''}" maxlength="6" type="tel"/>
            <span class="zk-error" id="co-pin-err">Valid 6-digit PIN needed.</span></div>
        </div>
        <div style="display:flex;gap:1rem;margin-bottom:1.2rem">
          <label style="display:flex;align-items:center;gap:.4rem;cursor:pointer;font-size:.88rem;font-weight:700">
            <input type="radio" name="atype" value="Home" checked> 🏠 Home
          </label>
          <label style="display:flex;align-items:center;gap:.4rem;cursor:pointer;font-size:.88rem;font-weight:700">
            <input type="radio" name="atype" value="Work"> 🏢 Work
          </label>
        </div>
        <button class="zk-btn" onclick="coNext()">Continue to Payment →</button>
      </div>`;
    return;
  }

  /* STEP 2 — PAYMENT */
  if (checkoutStep === 2) {
    m.innerHTML = `
      <div class="zk-head"><h2>💳 Payment</h2>${closeBtnHTML("modal-co")}</div>
      <div class="zk-body">${stepper}
        <div class="payment-options">
          <div class="pay-opt selected" id="pay-card" onclick="selPay('card')">
            <div class="pay-icon">💳</div><div class="pay-label">Card</div></div>
          <div class="pay-opt" id="pay-upi" onclick="selPay('upi')">
            <div class="pay-icon">📲</div><div class="pay-label">UPI</div></div>
          <div class="pay-opt" id="pay-cod" onclick="selPay('cod')">
            <div class="pay-icon">💵</div><div class="pay-label">COD</div></div>
        </div>

        <div class="pay-details show" id="pay-details-card">
          <div class="zk-field"><label class="zk-label">Card Number</label>
            <input class="zk-input" id="pay-cn" placeholder="1234  5678  9012  3456"
                   maxlength="19" oninput="fmtCard(this)" type="tel"/>
            <span class="zk-error" id="pay-cn-err">Valid 16-digit number needed.</span></div>
          <div class="zk-row">
            <div class="zk-field"><label class="zk-label">Name on Card</label>
              <input class="zk-input" id="pay-nm" placeholder="ARJUN MEHTA" type="text"/></div>
            <div class="zk-field"><label class="zk-label">Expiry (MM/YY)</label>
              <input class="zk-input" id="pay-ex" placeholder="MM/YY" maxlength="5"
                     oninput="fmtExpiry(this)" type="tel"/>
              <span class="zk-error" id="pay-ex-err">Valid expiry needed.</span></div>
          </div>
          <div class="zk-field"><label class="zk-label">CVV</label>
            <input class="zk-input" id="pay-cv" placeholder="•••" maxlength="4"
                   type="password" style="max-width:120px"/>
            <span class="zk-error" id="pay-cv-err">CVV required.</span></div>
        </div>

        <div class="pay-details" id="pay-details-upi">
          <div class="zk-field"><label class="zk-label">UPI ID</label>
            <input class="zk-input" id="pay-upiid" placeholder="name@okaxis" type="text"/>
            <span class="zk-error" id="pay-upi-err">Valid UPI ID needed (e.g. name@okaxis).</span></div>
          <p style="font-size:.8rem;color:#888;margin-top:.3rem">
            Supported: 💙 Paytm &nbsp; 🟣 PhonePe &nbsp; 💚 Google Pay</p>
        </div>

        <div class="pay-details" id="pay-details-cod">
          <div style="background:#f8f9ff;border-radius:14px;padding:1rem;display:flex;gap:.8rem;align-items:center">
            <span style="font-size:2rem">💵</span>
            <div><p style="font-weight:800;font-size:.92rem">Pay when your order arrives</p>
              <p style="font-size:.8rem;color:#888">Available up to ₹10,000 · ₹49 COD charge applies.</p></div>
          </div>
        </div>

        <div class="order-summary" style="margin-top:1.2rem">
          <h4>ORDER SUMMARY</h4>
          ${cart.map(i=>`<div class="order-item-row"><span>${i.name} × ${i.qty}</span><span>₹${fmt(i.price*i.qty)}</span></div>`).join("")}
          <div class="order-item-row"><span>Delivery</span><span class="tag-free">FREE</span></div>
          <div class="order-total-row"><span>Total Payable</span><span>₹${fmt(total)}</span></div>
        </div>

        <div style="display:flex;gap:.8rem">
          <button class="zk-btn secondary" style="margin:0" onclick="checkoutStep=1;renderCoStep()">← Back</button>
          <button class="zk-btn" style="margin:0" onclick="coNext()">Place Order 🚀</button>
        </div>
      </div>`;
    return;
  }

  /* STEP 3 — CONFIRMATION */
  if (checkoutStep === 3) {
    const oid  = "ZAP" + Math.floor(100000 + Math.random() * 900000);
    const eta  = new Date(Date.now() + 3 * 24 * 3600 * 1000)
                   .toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
    ORDER_DB[oid] = {
      product: cart[0]?.name || "Your Order",
      placed: new Date().toLocaleDateString("en-IN"),
      eta, currentStep: 0,
      steps: [
        {icon:"📋",label:"Order Placed",state:`${checkoutData.city}, ${checkoutData.state}`,time: new Date().toLocaleTimeString("en-IN")},
        {icon:"✅",label:"Order Confirmed",state:"ZAPKART Warehouse",time:"—"},
        {icon:"📦",label:"Packed & Ready",state:"Hub",time:"—"},
        {icon:"🚚",label:"Shipped",state:"In Transit",time:"—"},
        {icon:"🛵",label:"Out for Delivery",state:checkoutData.city,time:"—"},
        {icon:"🎉",label:"Delivered",state:"Your Doorstep",time:"—"},
      ]
    };
    cart = []; refreshCartUI();
    m.innerHTML = `
      <div class="zk-head"><h2>🎉 Order Confirmed</h2></div>
      <div class="zk-body">${stepper}
        <div class="zk-success-box">
          <div class="big-emoji">🎉</div>
          <h3>Order Placed Successfully!</h3>
          <p>Order <strong>${oid}</strong> confirmed.<br/>Estimated delivery: <strong>${eta}</strong></p>
          <div style="background:#f0fff8;border-radius:16px;padding:1.2rem;margin:1.5rem 0;text-align:left">
            <p style="font-size:.78rem;font-weight:700;color:#888;margin-bottom:.6rem;text-transform:uppercase">Delivery Details</p>
            <p style="font-weight:800">${checkoutData.name}</p>
            <p style="font-size:.85rem;color:#555">${checkoutData.addr}</p>
            <p style="font-size:.85rem;color:#555">${checkoutData.city}, ${checkoutData.state} — ${checkoutData.pin}</p>
            <p style="font-size:.85rem;color:#555">📞 ${checkoutData.phone}</p>
          </div>
          <p style="font-size:.82rem;color:#888;margin-bottom:1.5rem">
            Confirmation sent to <strong>${checkoutData.email}</strong></p>
          <button class="zk-btn green" onclick="closeModal('modal-co');openTrackOrder();setTimeout(()=>{document.getElementById('track-inp').value='${oid}';trackOrder();},300)">
            📦 Track Your Order
          </button>
          <button class="zk-btn secondary" onclick="closeModal('modal-co')">Continue Shopping</button>
        </div>
      </div>`;
  }
}

function coNext() {
  if (checkoutStep === 1) {
    const name  = document.getElementById("co-name")?.value.trim();
    const phone = document.getElementById("co-phone")?.value.trim();
    const email = document.getElementById("co-email")?.value.trim();
    const addr  = document.getElementById("co-addr")?.value.trim();
    const city  = document.getElementById("co-city")?.value.trim();
    const state = document.getElementById("co-state")?.value;
    const pin   = document.getElementById("co-pin")?.value.trim();
    const chk = (errId, ok) => { document.getElementById(errId)?.classList.toggle("show", !ok); return ok; };
    const ok = [
      chk("co-name-err",  name.length > 1),
      chk("co-phone-err", /^[6-9]\d{9}$/.test(phone)),
      chk("co-email-err", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
      chk("co-addr-err",  addr.length > 5),
      chk("co-city-err",  city.length > 1),
      chk("co-state-err", state !== ""),
      chk("co-pin-err",   /^\d{6}$/.test(pin)),
    ].every(Boolean);
    if (!ok) return;
    Object.assign(checkoutData, { name, phone, email, addr, city, state, pin,
      atype: document.querySelector('input[name="atype"]:checked')?.value || "Home" });
    checkoutStep = 2; renderCoStep();
  }
  else if (checkoutStep === 2) {
    const sel = document.querySelector(".pay-opt.selected")?.id;
    let ok = true;
    if (sel === "pay-card") {
      const cn  = (document.getElementById("pay-cn")?.value.replace(/\s/g,"") || "");
      const ex  = document.getElementById("pay-ex")?.value.trim();
      const cv  = document.getElementById("pay-cv")?.value.trim();
      document.getElementById("pay-cn-err")?.classList.toggle("show", cn.length !== 16);
      document.getElementById("pay-ex-err")?.classList.toggle("show", !/^\d{2}\/\d{2}$/.test(ex));
      document.getElementById("pay-cv-err")?.classList.toggle("show", cv.length < 3);
      if (cn.length !== 16 || !/^\d{2}\/\d{2}$/.test(ex) || cv.length < 3) ok = false;
    }
    if (sel === "pay-upi") {
      const upi = document.getElementById("pay-upiid")?.value.trim();
      const uok = /^[\w.-]+@[\w]+$/.test(upi);
      document.getElementById("pay-upi-err")?.classList.toggle("show", !uok);
      if (!uok) ok = false;
    }
    if (!ok) return;
    checkoutStep = 3; renderCoStep();
  }
}
function selPay(t) {
  document.querySelectorAll(".pay-opt").forEach(e => e.classList.remove("selected"));
  document.getElementById("pay-" + t)?.classList.add("selected");
  document.querySelectorAll(".pay-details").forEach(e => e.classList.remove("show"));
  document.getElementById("pay-details-" + t)?.classList.add("show");
}
function fmtCard(i)   { let v=i.value.replace(/\D/g,"").slice(0,16); i.value=v.replace(/(.{4})/g,"$1 ").trim(); }
function fmtExpiry(i) { let v=i.value.replace(/\D/g,"").slice(0,4); if(v.length>=3) v=v.slice(0,2)+"/"+v.slice(2); i.value=v; }


/* ────────────────────────────────────────────────────────────────
   SECTION 14 — CONTACT US
   ──────────────────────────────────────────────────────────────── */
function openContact() {
  const { m } = createModal("modal-contact");
  m.innerHTML = `
    <div class="zk-grad-head"><div class="gicon">📬</div><h2>Contact Us</h2>
      <p>We reply within 2 hours — no cap!</p></div>
    <div class="zk-body">
      <div class="contact-grid">
        <div class="contact-card"><span class="ci">📞</span><div><h4>Call / WhatsApp</h4><p>+91 98765 43210<br/>Mon–Sat · 9AM–9PM</p></div></div>
        <div class="contact-card"><span class="ci">📧</span><div><h4>Email Us</h4><p>support@zapkart.in</p></div></div>
        <div class="contact-card"><span class="ci">💬</span><div><h4>Live Chat</h4><p>24 × 7 on website</p></div></div>
        <div class="contact-card"><span class="ci">🏢</span><div><h4>Office</h4><p>ZAPKART HQ, Baner,<br/>Pune 411045, MH</p></div></div>
      </div>
      <div class="social-row">
        <button class="soc-btn s-insta" onclick="showToast('📷 Opening Instagram...')">📷 Instagram</button>
        <button class="soc-btn s-tiktok" onclick="showToast('🎵 Opening TikTok...')">🎵 TikTok</button>
        <button class="soc-btn s-yt"    onclick="showToast('▶️ Opening YouTube...')">▶️ YouTube</button>
        <button class="soc-btn s-tw"    onclick="showToast('🐦 Opening Twitter...')">🐦 Twitter</button>
      </div>
      <h3 style="font-size:1rem;font-weight:800;margin-bottom:1rem">📝 Send a Message</h3>
      <div class="zk-row">
        <div class="zk-field"><label class="zk-label">Name *</label>
          <input class="zk-input" id="ct-name" placeholder="Priya Sharma" type="text"/>
          <span class="zk-error" id="ct-name-err">Name required.</span></div>
        <div class="zk-field"><label class="zk-label">Email *</label>
          <input class="zk-input" id="ct-email" placeholder="priya@email.com" type="email"/>
          <span class="zk-error" id="ct-email-err">Valid email required.</span></div>
      </div>
      <div class="zk-field"><label class="zk-label">Subject</label>
        <select class="zk-select" id="ct-sub">
          <option>Order Issue</option><option>Return & Refund</option>
          <option>Product Query</option><option>Payment Problem</option>
          <option>General Feedback</option><option>Other</option>
        </select></div>
      <div class="zk-field"><label class="zk-label">Message *</label>
        <textarea class="zk-textarea" id="ct-msg" placeholder="Describe your issue..."></textarea>
        <span class="zk-error" id="ct-msg-err">Message required.</span></div>
      <button class="zk-btn" onclick="submitContact()">Send Message 📤</button>
    </div>`;
}
function submitContact() {
  const name  = document.getElementById("ct-name")?.value.trim();
  const email = document.getElementById("ct-email")?.value.trim();
  const msg   = document.getElementById("ct-msg")?.value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  document.getElementById("ct-name-err")?.classList.toggle("show", name.length < 2);
  document.getElementById("ct-email-err")?.classList.toggle("show", !emailOk);
  document.getElementById("ct-msg-err")?.classList.toggle("show", msg.length < 10);
  if (name.length < 2 || !emailOk || msg.length < 10) return;
  closeModal("modal-contact"); showToast("✅ Message sent! We'll reply within 2 hrs.");
}


/* ────────────────────────────────────────────────────────────────
   SECTION 15 — FAQ
   ──────────────────────────────────────────────────────────────── */
function openFAQ() {
  const { m } = createModal("modal-faq");
  m.innerHTML = `
    <div class="zk-head"><h2>❓ FAQ</h2>${closeBtnHTML("modal-faq")}</div>
    <div class="zk-body">
      ${FAQS.map((f, i) => `
        <div class="faq-item">
          <div class="faq-q" onclick="toggleFaqItem(${i})">
            <span>${f.q}</span><span class="faq-arrow" id="fa-${i}">▾</span>
          </div>
          <div class="faq-a" id="faq-${i}"><p>${f.a}</p></div>
        </div>`).join("")}
    </div>`;
}
function toggleFaqItem(i) {
  FAQS.forEach((_, j) => {
    const a = document.getElementById("faq-"+j), ar = document.getElementById("fa-"+j);
    if (a) a.style.maxHeight = "0px";
    if (ar) ar.style.transform = "rotate(0deg)";
  });
  const el = document.getElementById("faq-"+i), ar = document.getElementById("fa-"+i);
  const isOpen = el?.style.maxHeight !== "0px" && el?.style.maxHeight !== "";
  if (!isOpen && el) { el.style.maxHeight = "200px"; if (ar) ar.style.transform = "rotate(180deg)"; }
}


/* ────────────────────────────────────────────────────────────────
   SECTION 16 — RETURNS
   ──────────────────────────────────────────────────────────────── */
function openReturns() {
  const { m } = createModal("modal-ret");
  m.innerHTML = `
    <div class="zk-grad-head"><div class="gicon">📦</div><h2>Returns & Refunds</h2>
      <p>Easy 30-day returns. No questions asked.</p></div>
    <div class="zk-body">
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.5rem">
        ${[["📅","30-Day Window","Return any item within 30 days"],
           ["🚚","Free Pickup","We collect from your doorstep"],
           ["💰","Fast Refund","Refund within 3–5 business days"]]
          .map(([e,t,d])=>`<div style="text-align:center;background:#f8f9ff;border-radius:14px;padding:1.2rem .8rem">
            <div style="font-size:2rem;margin-bottom:.4rem">${e}</div>
            <h4 style="font-size:.82rem;font-weight:800;margin-bottom:.2rem">${t}</h4>
            <p style="font-size:.72rem;color:#777;line-height:1.4">${d}</p></div>`).join("")}
      </div>
      <h3 style="font-size:1rem;font-weight:800;margin-bottom:1rem">🔄 Initiate a Return</h3>
      <div class="zk-field"><label class="zk-label">Order ID *</label>
        <input class="zk-input" id="ret-id" placeholder="ZAP100001" type="text"/>
        <span class="zk-error" id="ret-id-err">Order ID required.</span></div>
      <div class="zk-field"><label class="zk-label">Registered Email *</label>
        <input class="zk-input" id="ret-email" placeholder="you@email.com" type="email"/>
        <span class="zk-error" id="ret-email-err">Valid email required.</span></div>
      <div class="zk-field"><label class="zk-label">Reason</label>
        <select class="zk-select" id="ret-reason">
          <option>Wrong size/fit</option><option>Damaged product received</option>
          <option>Product looks different</option><option>Wrong item delivered</option>
          <option>Changed my mind</option><option>Other</option>
        </select></div>
      <div class="zk-field"><label class="zk-label">Comments</label>
        <textarea class="zk-textarea" id="ret-cmts" placeholder="Additional details..."></textarea></div>
      <button class="zk-btn" onclick="submitReturn()">Submit Return Request 📦</button>
    </div>`;
}
function submitReturn() {
  const id    = document.getElementById("ret-id")?.value.trim();
  const email = document.getElementById("ret-email")?.value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  document.getElementById("ret-id-err")?.classList.toggle("show", id.length < 3);
  document.getElementById("ret-email-err")?.classList.toggle("show", !emailOk);
  if (id.length < 3 || !emailOk) return;
  closeModal("modal-ret"); showToast("✅ Return request submitted! Pickup within 48 hrs.");
}


/* ────────────────────────────────────────────────────────────────
   SECTION 17 — NOTIFICATION POP-UPS
   ──────────────────────────────────────────────────────────────── */
const NOTIFS = [
  { icon: "🔥", title: "Flash Sale Started!", msg: "Up to 80% off — next 2 hours only!" },
  { icon: "🎁", title: "Exclusive Offer", msg: "Use code ZAP20 for extra 20% off!" },
  { icon: "👟", title: "New Shoe Drop", msg: "Chunky Sneakers are back in stock!" },
  { icon: "💍", title: "Jewellery Week", msg: "All jewellery at flat 50% off today!" },
];
let notifIdx = 0;
function showNotif() {
  const n = NOTIFS[notifIdx % NOTIFS.length]; notifIdx++;
  let el = document.getElementById("zk-notif");
  if (!el) {
    el = document.createElement("div");
    el.id = "zk-notif";
    el.innerHTML = `
      <div class="notif-icon" id="ni"></div>
      <div class="notif-text"><h4 id="nt"></h4><p id="nm"></p></div>
      <button id="notif-x" onclick="document.getElementById('zk-notif').classList.remove('show')">✕</button>`;
    document.body.appendChild(el);
  }
  document.getElementById("ni").textContent = n.icon;
  document.getElementById("nt").textContent = n.title;
  document.getElementById("nm").textContent = n.msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 5000);
}


/* ────────────────────────────────────────────────────────────────
   SECTION 18 — WIRE FOOTER LINKS
   ──────────────────────────────────────────────────────────────── */
function wireFooter() {
  document.querySelectorAll(".footer-col a").forEach(a => {
    const t = a.textContent.trim().toLowerCase();
    if (t.includes("about"))  { a.onclick = e => { e.preventDefault(); openAboutUs(); }; }
    if (t.includes("contact")){ a.onclick = e => { e.preventDefault(); openContact(); }; }
    if (t.includes("track"))  { a.onclick = e => { e.preventDefault(); openTrackOrder(); }; }
    if (t.includes("faq"))    { a.onclick = e => { e.preventDefault(); openFAQ(); }; }
    if (t.includes("return") || t.includes("refund")){ a.onclick = e => { e.preventDefault(); openReturns(); }; }
    if (t.includes("career")) { a.onclick = e => { e.preventDefault(); showToast("🚀 Careers coming soon!"); }; }
    if (t.includes("blog"))   { a.onclick = e => { e.preventDefault(); showToast("📝 Blog launching soon!"); }; }
    if (t.includes("press"))  { a.onclick = e => { e.preventDefault(); showToast("📰 Press kit on request!"); }; }
    if (t.includes("instagram")){ a.onclick = e => { e.preventDefault(); showToast("📷 Opening Instagram..."); }; }
    if (t.includes("tiktok")) { a.onclick = e => { e.preventDefault(); showToast("🎵 Opening TikTok..."); }; }
    if (t.includes("youtube")){ a.onclick = e => { e.preventDefault(); showToast("▶️ Opening YouTube..."); }; }
    if (t.includes("twitter")){ a.onclick = e => { e.preventDefault(); showToast("🐦 Opening Twitter..."); }; }
  });
  // Nav login button
  document.querySelectorAll(".nav-btn.login").forEach(b => {
    b.onclick = () => {
      if (currentUser) showToast(`👤 Logged in as ${currentUser.name}`);
      else buildLoginGate();
    };
  });
  // Checkout button
  const coBtn = document.querySelector(".checkout-btn");
  if (coBtn) coBtn.onclick = openCheckout;
}


/* ────────────────────────────────────────────────────────────────
   SECTION 19 — BOOT
   ──────────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  buildLoginGate();       // Show login gate first
  renderAll();            // Render product grids
  startSlider();          // Hero slider
  startCountdown();       // Deals timer
  observeSA();            // Scroll animations
  wireFooter();           // Footer + nav buttons
  console.log("✅ ZAPKART script.js — fully loaded");
});