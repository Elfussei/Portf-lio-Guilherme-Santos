import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // --- Funcionalidade de Edição Visual de Imagens ---
  
  // Variáveis de edição
  let fileInput: HTMLInputElement | null = null;
  let currentEditingElement: HTMLElement | null = null;
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (isLocalhost) {
    fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
  }

  // Seletores para todos os elementos que têm imagens/mockups
  const imageElements = document.querySelectorAll('.avatar, .phone-mockup, .phone-mockup-small, .laptop-mockup, .footer-photo, .floating-graphic, .phone-mockup-large, .phone-mockup-comp');

  // Adicionar cursor pointer a todos eles
  imageElements.forEach(el => {
    if (isLocalhost) {
      (el as HTMLElement).style.cursor = 'pointer';
      (el as HTMLElement).title = 'Clique para alterar a imagem';
    }
    
    // Tentar carregar imagem do localStorage caso exista
    const elId = el.getAttribute('id');
    if (elId) {
      el.setAttribute('data-img-id', elId);
      const savedImg = localStorage.getItem(`img_${elId}`);
      if (savedImg) {
        applyImage(el as HTMLElement, savedImg);
      }
    }

    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (!isLocalhost || !fileInput) return;
      currentEditingElement = el as HTMLElement;
      fileInput.click();
    });
  });

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file && currentEditingElement) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const base64Img = event.target?.result as string;
        
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const MAX_WIDTH = 1200; // Reduzido para poupar ainda mais espaço
            const MAX_HEIGHT = 1200;
            
            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                // Comprimir para JPEG com 60% de qualidade
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                
                // Aplicar visualmente
                applyImage(currentEditingElement!, compressedBase64);
                
                // Guardar no localStorage
                const elId = currentEditingElement!.getAttribute('data-img-id');
                if (elId) {
                  try {
                    localStorage.setItem(`img_${elId}`, compressedBase64);
                  } catch (e) {
                    console.warn('LocalStorage cheio!', e);
                    alert('Aviso: Mesmo com compressão, a memória local está cheia. Limpe a cache do navegador.');
                  }
                }
            }
        };
        img.src = base64Img;
      };
      
      reader.readAsDataURL(file);
    }
    // Limpar o input para permitir selecionar o mesmo ficheiro novamente se necessário
    fileInput!.value = '';
  });
  }

  function applyImage(el: HTMLElement, imgData: string) {
    if (el.tagName.toLowerCase() === 'img') {
      (el as HTMLImageElement).src = imgData;
    } else {
      el.style.backgroundImage = `url('${imgData}')`;
    }
  }



  // --- Funcionalidade de Edição de Links ---
  const savedLinks = JSON.parse(localStorage.getItem('savedLinks') || '{}');
  const linkElements = document.querySelectorAll('.editable-link');
  
  linkElements.forEach(el => {
    const id = el.id;
    const anchor = el as HTMLAnchorElement;
    
    // Carregar dados salvos
    if (id && savedLinks[id]) {
      if (savedLinks[id].text) anchor.innerText = savedLinks[id].text;
      if (savedLinks[id].href) anchor.setAttribute('href', savedLinks[id].href);
    }
    
    anchor.style.cursor = 'pointer';
    anchor.title = 'Clique para editar o link';
    
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      
      const currentText = anchor.innerText;
      const currentHref = anchor.getAttribute('href') || '';
      
      const newText = prompt("Editar texto do link:", currentText);
      if (newText === null) return;
      
      const newHref = prompt("Editar URL (Ex: https://... ou mailto:...):", currentHref);
      if (newHref === null) return;
      
      anchor.innerText = newText;
      anchor.setAttribute('href', newHref);
      
      if (id) {
        const links = JSON.parse(localStorage.getItem('savedLinks') || '{}');
        links[id] = { text: newText, href: newHref };
        localStorage.setItem('savedLinks', JSON.stringify(links));
      }
    });
  });

  // --- Funcionalidade do Menu de Navegação ---
  const menuToggle = document.getElementById('menuToggle');
  const fullscreenMenu = document.getElementById('fullscreenMenu');
  const menuItems = document.querySelectorAll('.menu-item');

  if (menuToggle && fullscreenMenu) {
    menuToggle.addEventListener('click', () => {
      fullscreenMenu.classList.toggle('active');
    });

    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        fullscreenMenu.classList.remove('active');
      });
    });
  }

  // --- Initialize GSAP Animations ---
  
  // Hero Section (On Load)
  gsap.from('.hero-tags .tag', { opacity: 0, y: 20, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.2 });
  gsap.from('.hero-title', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', delay: 0.3 });
  gsap.from('.hero-desc', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out', delay: 0.5 });
  gsap.from('.avatar', { opacity: 0, scale: 0.8, duration: 0.8, ease: 'back.out(1.7)', delay: 0.4 });

  // Standard Section Fade Up
  const sections = gsap.utils.toArray('.animate-on-scroll:not(.experiencia-section):not(.footer-section)');
  sections.forEach((sec: any) => {
    gsap.from(sec, {
      scrollTrigger: {
        trigger: sec,
        start: 'top 80%',
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  // Staggered Grids (Cards)
  const grids = document.querySelectorAll('.solucoes-grid, .tech-grid, .porque-grid, .project-content');
  grids.forEach(grid => {
    const cards = grid.querySelectorAll('.stagger-in');
    if(cards.length > 0) {
      gsap.from(cards, {
        scrollTrigger: {
          trigger: grid,
          start: 'top 85%',
        },
        opacity: 0,
        y: 30,
        scale: 0.95,
        duration: 0.6,
        stagger: 0.15,
        ease: 'back.out(1.2)'
      });
    }
  });

  // Parallax on images
  gsap.utils.toArray('.phone-mockup, .laptop-mockup, .phone-mockup-small').forEach((img: any) => {
    gsap.to(img, {
      scrollTrigger: {
        trigger: img,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: -20,
      ease: 'none'
    });
  });

  // Footer Composition Fan-out
  const footerSec = document.querySelector('.footer-section');
  if (footerSec) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerSec,
        start: 'top 75%',
      }
    });
    
    tl.from('.footer-title, .footer-top .tag', { opacity: 0, y: 30, duration: 0.6, stagger: 0.1, ease: 'power2.out' })
      .from('.footer-photo', { opacity: 0, scale: 0.8, duration: 0.6, ease: 'back.out(1.5)' }, "-=0.4")
      .from('.footer-card', { opacity: 0, x: -30, duration: 0.6, ease: 'power2.out' }, "-=0.4")
      .from('.phone-mockup-comp', { 
        opacity: 0, 
        y: 50, 
        rotation: 0, 
        scale: 0.8, 
        duration: 0.8, 
        stagger: 0.1, 
        ease: 'back.out(1.5)' 
      }, "-=0.2");
  }

  // Inject Dynamic Projects
  const dynamicContainer = document.getElementById('dynamic-projects-container');
  if (dynamicContainer) {
    const customProjects = JSON.parse(localStorage.getItem('custom_projects') || '[]');
    let dynamicHTML = '';
    
    customProjects.forEach((p: any, i: number) => {
      const isEven = i % 2 === 0;
      dynamicHTML += `
        <section class="project-section" style="margin-top: 4rem;">
            <div class="project-header">
                <h1 class="project-title dyn-stagger">${p.title.replace(' ', '<br>')}</h1>
            </div>
            <div class="project-content" style="${!isEven ? 'flex-direction: row-reverse;' : ''}">
                <div class="project-info bg-purple text-white stagger-in dyn-stagger">
                    <h3 class="project-info-title">${p.subtitle}</h3>
                    <p class="project-info-desc">${p.desc}</p>
                    ${p.stat1Value ? `
                    <div class="project-stats">
                        <div class="stat">
                            <h4>${p.stat1Value}</h4>
                            <span>${p.stat1Label}</span>
                        </div>
                    </div>
                    ` : ''}
                </div>
                <div class="project-visual stagger-in dyn-stagger">
                    <div class="laptop-mockup editable-image" data-img-id="dyn-laptop-${p.id}" id="dyn-laptop-${p.id}" style="background-image: url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop'); cursor: pointer;" title="Clique para alterar a imagem"></div>
                    <div class="phone-mockup-small editable-image" data-img-id="dyn-phone-${p.id}" id="dyn-phone-${p.id}" style="background-image: url('https://images.unsplash.com/photo-1601598851547-4302969d0614?q=80&w=1964&auto=format&fit=crop'); cursor: pointer;" title="Clique para alterar a imagem"></div>
                </div>
            </div>
        </section>
      `;
    });
    
    if (customProjects.length > 0) {
      dynamicContainer.innerHTML = dynamicHTML;
    }

    // Attach click listeners to new editable images
    const newEditableImages = dynamicContainer.querySelectorAll('.editable-image');
    newEditableImages.forEach(el => {
      const elId = el.getAttribute('id');
      const savedImg = localStorage.getItem(`img_${elId}`);
      if (savedImg) {
        if (el.tagName.toLowerCase() === 'img') {
          (el as HTMLImageElement).src = savedImg;
        } else {
          (el as HTMLElement).style.backgroundImage = `url('${savedImg}')`;
        }
      }
      el.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isLocalhost || !fileInput) return;
        currentEditingElement = el as HTMLElement;
        fileInput.click();
      });
    });

    // Initialize GSAP for injected dynamic elements
    const injectedSections = dynamicContainer.querySelectorAll('.project-section');
    injectedSections.forEach(sec => {
       const dynCards = sec.querySelectorAll('.dyn-stagger');
       gsap.from(dynCards, {
        scrollTrigger: {
          trigger: sec,
          start: 'top 85%',
        },
        opacity: 0,
        y: 30,
        scale: 0.95,
        duration: 0.6,
        stagger: 0.15,
        ease: 'back.out(1.2)'
      });
    });
    ScrollTrigger.refresh();
  }

  console.log('Portfólio carregado e animado com GSAP! Podes clicar em qualquer imagem/mockup para a alterar.');

  // --- Exportador Local Flutuante ---
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const toolbar = document.createElement('div');
    toolbar.style.position = 'fixed';
    toolbar.style.bottom = '20px';
    toolbar.style.right = '20px';
    toolbar.style.backgroundColor = '#1f2937';
    toolbar.style.padding = '15px';
    toolbar.style.borderRadius = '12px';
    toolbar.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
    toolbar.style.zIndex = '99999';
    toolbar.style.display = 'flex';
    toolbar.style.gap = '10px';
    toolbar.style.alignItems = 'center';

    const exportBtn = document.createElement('button');
    exportBtn.innerText = '💾 Guardar & Exportar HTML';
    exportBtn.style.backgroundColor = '#10b981';
    exportBtn.style.color = 'white';
    exportBtn.style.border = 'none';
    exportBtn.style.padding = '10px 15px';
    exportBtn.style.borderRadius = '6px';
    exportBtn.style.cursor = 'pointer';
    exportBtn.style.fontWeight = 'bold';

    const adminBtn = document.createElement('a');
    adminBtn.innerText = '⚙️ Projetos';
    adminBtn.href = '/admin.html';
    adminBtn.style.backgroundColor = '#4b5563';
    adminBtn.style.color = 'white';
    adminBtn.style.textDecoration = 'none';
    adminBtn.style.padding = '10px 15px';
    adminBtn.style.borderRadius = '6px';
    adminBtn.style.fontSize = '0.9rem';

    toolbar.appendChild(adminBtn);
    toolbar.appendChild(exportBtn);
    document.body.appendChild(toolbar);

    exportBtn.addEventListener('click', async () => {
      exportBtn.innerText = 'A processar...';
      try {
        const res = await fetch('/index.html?t=' + Date.now());
        const htmlText = await res.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // Limpar scripts injetados pelo Vite em dev
        const scripts = doc.querySelectorAll('script');
        scripts.forEach(script => {
          const src = script.getAttribute('src');
          if (src && (src.includes('@vite') || src.includes('react-refresh'))) {
            script.remove();
          }
        });

        // 1. Injetar Projetos
        const customProjects = JSON.parse(localStorage.getItem('custom_projects') || '[]');
        if (customProjects.length > 0) {
            let dynamicHTML = '';
            customProjects.forEach((p: any, i: number) => {
                const isEven = i % 2 === 0;
                dynamicHTML += `
                <section class="project-section" style="margin-top: 4rem;">
                    <div class="project-header">
                        <h1 class="project-title dyn-stagger">${p.title.replace(' ', '<br>')}</h1>
                    </div>
                    <div class="project-content" style="${!isEven ? 'flex-direction: row-reverse;' : ''}">
                        <div class="project-info bg-purple text-white stagger-in dyn-stagger">
                            <h3 class="project-info-title">${p.subtitle}</h3>
                            <p class="project-info-desc">${p.desc}</p>
                            ${p.stat1Value ? `
                            <div class="project-stats">
                                <div class="stat">
                                    <h4>${p.stat1Value}</h4>
                                    <span>${p.stat1Label}</span>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                        <div class="project-visual stagger-in dyn-stagger">
                            <div class="laptop-mockup editable-image" data-img-id="dyn-laptop-${p.id}" id="dyn-laptop-${p.id}" style="background-image: url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop'); cursor: pointer;" title="Clique para alterar a imagem"></div>
                            <div class="phone-mockup-small editable-image" data-img-id="dyn-phone-${p.id}" id="dyn-phone-${p.id}" style="background-image: url('https://images.unsplash.com/photo-1601598851547-4302969d0614?q=80&w=1964&auto=format&fit=crop'); cursor: pointer;" title="Clique para alterar a imagem"></div>
                        </div>
                    </div>
                </section>
                `;
            });
            const dynamicContainer = doc.getElementById('dynamic-projects-container');
            if (dynamicContainer) {
                dynamicContainer.innerHTML = dynamicHTML;
            }
        }

        // 2. Injetar Links
        const savedLinks = JSON.parse(localStorage.getItem('savedLinks') || '{}');
        Object.keys(savedLinks).forEach(id => {
            const el = doc.getElementById(id);
            if (el) {
                if (savedLinks[id].text) el.innerText = savedLinks[id].text;
                if (savedLinks[id].href) el.setAttribute('href', savedLinks[id].href);
            }
        });

        // 3. Injetar Imagens

        const editableImages = doc.querySelectorAll('.avatar, .phone-mockup, .phone-mockup-small, .laptop-mockup, .footer-photo, .floating-graphic, .phone-mockup-large, .phone-mockup-comp, .editable-image');
        
        editableImages.forEach((el) => {
            let elId = el.getAttribute('data-img-id') || el.getAttribute('id');
            const savedImg = localStorage.getItem(`img_${elId}`);
            if (savedImg) {
                if (el.tagName.toLowerCase() === 'img') {
                    el.setAttribute('src', savedImg);
                } else {
                    (el as HTMLElement).style.backgroundImage = `url('${savedImg}')`;
                }
            }
        });

        const finalHTML = "<!DOCTYPE html>\\n" + doc.documentElement.outerHTML;
        
        const blob = new Blob([finalHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'index.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        exportBtn.innerText = '✅ Exportado!';
        setTimeout(() => { exportBtn.innerText = '💾 Guardar & Exportar HTML'; }, 3000);
      } catch (err) {
        console.error(err);
        alert('Erro ao exportar o código.');
        exportBtn.innerText = '❌ Erro';
      }
    });
  }
});
