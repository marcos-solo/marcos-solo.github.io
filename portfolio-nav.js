/**
 * MARCOS SOLOMON - PORTFOLIO INTERACTIVE CORE
 * Network & Security Engineer (L2/L3)
 * Features: Mobile navigation, Cyber Canvas, Interactive Terminal,
 * Project & Lab Filtering, Lightbox Gallery, and Toast Feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Current Year
  document.querySelectorAll('.current-year').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  // 2. Navigation & Mobile Drawer
  initNavbar();

  // 3. Cyber Network Canvas Background
  initCyberCanvas();

  // 4. Interactive Engineer Terminal
  initTerminal();

  // 5. Interactive Filtering & Live Search
  initFilters();

  // 6. Quick Copy & Toast Notifications
  initCopyButtons();
});

/* ==========================================================================
   1. NAVIGATION & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const toggle = navbar.querySelector('.navbar-toggle');
  const menu = navbar.querySelector('.navbar-menu');
  const backdrop = navbar.querySelector('.nav-backdrop');
  const icon = toggle?.querySelector('i');

  if (!toggle || !menu) return;

  const closeMenu = () => {
    navbar.classList.remove('is-open');
    menu.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    menu.setAttribute('aria-hidden', String(window.innerWidth <= 768));
    if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
    if (icon) {
      icon.className = 'fas fa-bars';
    }
  };

  const openMenu = () => {
    navbar.classList.add('is-open');
    menu.classList.add('is-open');
    document.body.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    menu.setAttribute('aria-hidden', 'false');
    if (backdrop) backdrop.setAttribute('aria-hidden', 'false');
    if (icon) {
      icon.className = 'fas fa-xmark';
    }
  };

  toggle.addEventListener('click', () => {
    const isOpen = navbar.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbar.classList.contains('is-open')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navbar.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   2. CYBER NETWORK CANVAS BACKGROUND
   ========================================================================== */
function initCyberCanvas() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;

  // Honor user reduced motion preferences
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const nodeCount = Math.min(Math.floor((width * height) / 22000), 55);
  const nodes = [];
  const mouse = { x: null, y: null, maxDist: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Create nodes
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 1,
      color: Math.random() > 0.4 ? 'rgba(240, 160, 120, ' : 'rgba(0, 210, 255, ',
      opacity: Math.random() * 0.5 + 0.2
    });
  }

  let animationFrameId;

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Update & draw nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = n.color + n.opacity + ')';
      ctx.fill();

      // Connect near nodes
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dx = n.x - n2.x;
        const dy = n.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 115) {
          const alpha = (1 - dist / 115) * 0.22;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `rgba(163, 178, 194, ${alpha})`;
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
      }

      // Mouse connection
      if (mouse.x !== null && mouse.y !== null) {
        const mdx = n.x - mouse.x;
        const mdy = n.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mDist < mouse.maxDist) {
          const mAlpha = (1 - mDist / mouse.maxDist) * 0.4;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(240, 160, 120, ${mAlpha})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   3. INTERACTIVE CYBER TERMINAL EMULATOR
   ========================================================================== */
function initTerminal() {
  const terminal = document.getElementById('terminal-window');
  if (!terminal) return;

  const output = terminal.querySelector('.terminal-output');
  const form = terminal.querySelector('.terminal-form');
  const input = terminal.querySelector('.terminal-input');
  const cmdBtns = terminal.querySelectorAll('.terminal-cmd-btn');

  if (!output || !input) return;

  const commandHistory = [];
  let historyIndex = -1;

  const commands = {
    help: () => `
<div class="terminal-line accent">Available Commands:</div>
<div class="terminal-line">  <span class="cmd-echo">whoami</span>          - Overview of Marcos Solomon</div>
<div class="terminal-line">  <span class="cmd-echo">cat skills.txt</span>  - Core networking & security proficiencies</div>
<div class="terminal-line">  <span class="cmd-echo">nmap -sV</span>        - Run network services & firewall inspection</div>
<div class="terminal-line">  <span class="cmd-echo">ping defense</span>    - Verify SOC telemetry & connectivity</div>
<div class="terminal-line">  <span class="cmd-echo">projects</span>        - View highlighted engineering projects</div>
<div class="terminal-line">  <span class="cmd-echo">labs</span>            - View hands-on lab challenges</div>
<div class="terminal-line">  <span class="cmd-echo">contact</span>         - Direct email, phone, and links</div>
<div class="terminal-line">  <span class="cmd-echo">clear</span>           - Clear the terminal screen</div>
`,
    whoami: () => `
<div class="terminal-line accent">NAME:</div> Marcos Solomon
<div class="terminal-line accent">ROLE:</div> Network & Security Engineer (L2/L3) | Corporate & Technical Trainer
<div class="terminal-line accent">TAGLINE:</div> Secure networks. Investigate threats. Automate resilience.
<div class="terminal-line accent">SUMMARY:</div> I combine network engineering, defensive security, and infrastructure automation to strengthen enterprise environments. I analyze security telemetry, investigate suspicious activity, apply network security controls, and build repeatable infrastructure using Terraform and Ansible.
<div class="terminal-line accent">FOCUS AREAS:</div> SOC Operations | Security Incident Investigation | Network Security | Threat Detection & Analysis | Infrastructure Automation | Technical Training
<div class="terminal-line success">STATUS: [ONLINE] Open for Network & Security Engineering Roles</div>
`,
    'cat skills.txt': () => `
<div class="terminal-line accent">=== NETWORK & INFRASTRUCTURE ===</div>
<div class="terminal-line">  • Cisco Routing & Switching: VLANs, STP, Inter-VLAN, OSPF, BGP basics, NAT, ACLs</div>
<div class="terminal-line">  • VPN & Remote Access: IPSec, SSL VPN, High-Availability tunnels</div>
<div class="terminal-line">  • Infrastructure as Code: Terraform (Provisioning), Ansible (Configuration)</div>
<div class="terminal-line">  • Cloud & Virtualization: Google Cloud, VMware, Pwnbox, Linux/Unix</div>

<div class="terminal-line accent">=== SECURITY & DEFENSIVE OPERATIONS ===</div>
<div class="terminal-line">  • Defensive Sec & SOC: SIEM (Splunk), Wireshark, Incident Response, RCA</div>
<div class="terminal-line">  • Threat Hunting & Forensics: MITRE ATT&CK, Windows/Linux log correlation</div>
<div class="terminal-line">  • Penetration Testing: Nmap, Burp Suite, Metasploit, OWASP Top 10</div>
`,
    skills: () => commands['cat skills.txt'](),
    'nmap -sV': () => `
<div class="terminal-line info">Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toLocaleTimeString()}</div>
<div class="terminal-line info">Nmap scan report for marcos-net.internal (10.10.10.1)</div>
<div class="terminal-line">Host is up (0.00042s latency).</div>
<div class="terminal-line accent">PORT     STATE    SERVICE       VERSION</div>
<div class="terminal-line">22/tcp   open     ssh           OpenSSH 9.3p1 (Hardened, Key-Auth Only)</div>
<div class="terminal-line">53/udp   open     domain        CoreDNS (DNSSEC Enabled, Split-Horizon)</div>
<div class="terminal-line">80/tcp   filtered http          Cisco ASA / FortiGate (301 Moved to 443)</div>
<div class="terminal-line">443/tcp  open     ssl/https     TLSv1.3 Encrypted Gateway</div>
<div class="terminal-line">500/udp  open     isakmp        IPSec IKEv2 Gateway (Active)</div>
<div class="terminal-line success">✓ Network Segmentation: Active (VLAN 10 Mgmt, VLAN 20 Prod, VLAN 30 DMZ)</div>
<div class="terminal-line success">✓ Zero-Trust ACLs: Enforced</div>
`,
    nmap: () => commands['nmap -sV'](),
    'ping defense': () => `
<div class="terminal-line info">PING defense.soc.internal (10.14.0.5): 56 data bytes</div>
<div class="terminal-line">64 bytes from 10.14.0.5: icmp_seq=0 ttl=64 time=0.482 ms [SIEM Splunk Agent OK]</div>
<div class="terminal-line">64 bytes from 10.14.0.5: icmp_seq=1 ttl=64 time=0.395 ms [IDS/IPS Telemetry OK]</div>
<div class="terminal-line">64 bytes from 10.14.0.5: icmp_seq=2 ttl=64 time=0.412 ms [Wireshark TAP Active]</div>
<div class="terminal-line">64 bytes from 10.14.0.5: icmp_seq=3 ttl=64 time=0.378 ms [Firewall ACLs Verified]</div>
<div class="terminal-line success">--- defense.soc.internal ping statistics ---</div>
<div class="terminal-line success">4 packets transmitted, 4 packets received, 0.0% packet loss, rtt avg 0.416 ms</div>
`,
    ping: () => commands['ping defense'](),
    projects: () => `
<div class="terminal-line accent">HIGHLIGHTED PROJECTS:</div>
<div class="terminal-line">1. <a href="projects.html#security-assessment" style="color:var(--primary);text-decoration:underline;">Business Systems Security Assessment</a> (Bethsaida Medicare & WebSeal)</div>
<div class="terminal-line">2. <a href="projects.html#blue-team-investigations" style="color:var(--primary);text-decoration:underline;">Blue Team Labs Online Investigations</a> (BEC-KY, Squid Game, Cap, The Report II)</div>
<div class="terminal-line">3. <a href="projects.html#network-infrastructure-as-code" style="color:var(--primary);text-decoration:underline;">Secure Network Infrastructure as Code</a> (Terraform + Ansible)</div>
<div class="terminal-line">4. <a href="https://github.com/marcos-solo/hosi_dss" target="_blank" style="color:var(--primary);text-decoration:underline;">Hospital Decision Support System</a> (Django + React + MySQL)</div>
<div class="terminal-line info">Explore more: <a href="projects.html" style="color:var(--cyber-cyan);">View all 10 projects &rarr;</a></div>
`,
    labs: () => `
<div class="terminal-line accent">HANDS-ON LAB CHALLENGES:</div>
<div class="terminal-line">• 20+ documented challenges across Hack The Box, TryHackMe, BTLO, and PicoCTF</div>
<div class="terminal-line">• Topics: Windows/Linux Fundamentals, Active Directory, Splunk, Forensics, WiFi, L2 MITM</div>
<div class="terminal-line info">Explore details: <a href="labs.html" style="color:var(--cyber-cyan);">Open Lab Challenges &rarr;</a></div>
`,
    contact: () => `
<div class="terminal-line accent">CONTACT INFORMATION:</div>
<div class="terminal-line">  • Email:    <a href="mailto:solomonmarcos34@gmail.com" style="color:var(--cyber-cyan);">solomonmarcos34@gmail.com</a></div>
<div class="terminal-line">  • Phone:    <a href="tel:+254741840839" style="color:var(--cyber-cyan);">+254 741 840 839</a></div>
<div class="terminal-line">  • LinkedIn: <a href="https://linkedin.com/in/marcos-solomon" target="_blank" style="color:var(--primary);">linkedin.com/in/marcos-solomon</a></div>
<div class="terminal-line">  • GitHub:   <a href="https://github.com/marcos-solo" target="_blank" style="color:var(--primary);">github.com/marcos-solo</a></div>
`,
    clear: () => {
      output.innerHTML = '';
      return '';
    }
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    commandHistory.push(cmd);
    historyIndex = commandHistory.length;

    // Render command prompt echo
    const echoDiv = document.createElement('div');
    echoDiv.className = 'terminal-line';
    echoDiv.innerHTML = `<span class="terminal-prompt"><span class="terminal-prompt-user">marcos@solomon</span>:<span class="terminal-prompt-path">~</span>$</span> <span class="cmd-echo">${escapeHtml(cmd)}</span>`;
    output.appendChild(echoDiv);

    const normalizedCmd = cmd.toLowerCase();
    let responseHtml = '';

    if (commands[normalizedCmd]) {
      responseHtml = commands[normalizedCmd]();
    } else {
      responseHtml = `<div class="terminal-line warning">command not found: "${escapeHtml(cmd)}". Type <span class="cmd-echo">help</span> to view available commands.</div>`;
    }

    if (responseHtml) {
      const respDiv = document.createElement('div');
      respDiv.className = 'terminal-response';
      respDiv.innerHTML = responseHtml;
      output.appendChild(respDiv);
    }

    terminal.querySelector('.terminal-body').scrollTop = terminal.querySelector('.terminal-body').scrollHeight;
  }

  // Handle Form Submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value;
      input.value = '';
      executeCommand(val);
    });
  }

  // Handle Command History (Up / Down arrows)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        input.value = '';
      }
    }
  });

  // Handle Quick Command Buttons
  cmdBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
      }
    });
  });
}

/* ==========================================================================
   4. INTERACTIVE CATEGORY FILTERING & LIVE SEARCH
   ========================================================================== */
function initFilters() {
  const filterToolbar = document.querySelector('.filter-toolbar');
  if (!filterToolbar) return;

  const searchInput = filterToolbar.querySelector('.filter-search-input');
  const clearBtn = filterToolbar.querySelector('.search-clear-btn');
  const pills = filterToolbar.querySelectorAll('.filter-pill');
  const countEl = filterToolbar.querySelector('.filter-results-count');
  const noResults = document.querySelector('.no-results-card');

  // Determine items to filter (projects or labs)
  const items = document.querySelectorAll('.project-item, .lab');
  if (items.length === 0) return;

  let currentCategory = 'all';
  let searchQuery = '';

  function applyFilter() {
    let visibleCount = 0;
    const query = searchQuery.trim().toLowerCase();

    items.forEach((item) => {
      const category = item.getAttribute('data-category') || '';
      const textContent = item.textContent.toLowerCase();

      const matchesCategory = currentCategory === 'all' || category.includes(currentCategory);
      const matchesSearch = !query || textContent.includes(query);

      if (matchesCategory && matchesSearch) {
        item.style.display = '';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    // Update count display
    if (countEl) {
      countEl.textContent = `Showing ${visibleCount} of ${items.length}`;
    }

    // Toggle No Results card
    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    // Toggle clear button
    if (clearBtn) {
      clearBtn.style.display = query.length > 0 ? 'block' : 'none';
    }
  }

  // Handle category pill clicks
  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-category') || 'all';
      applyFilter();
    });
  });

  // Handle search input with debouncing
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQuery = e.target.value;
        applyFilter();
      }, 150);
    });
  }

  // Handle search clear
  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      applyFilter();
      searchInput.focus();
    });
  }

  // Initial count setup
  applyFilter();
}

/* ==========================================================================
   5. QUICK COPY & TOAST NOTIFICATIONS
   ========================================================================== */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('[data-copy]');
  if (copyBtns.length === 0) return;

  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-notification';
    toast.innerHTML = '<i class="fas fa-check-circle" aria-hidden="true"></i> <span class="toast-text">Copied to clipboard!</span>';
    document.body.appendChild(toast);
  }

  let toastTimeout;

  function showToast(message) {
    const textEl = toast.querySelector('.toast-text');
    if (textEl) textEl.textContent = message;

    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  copyBtns.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || text;

      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        showToast(`Copied ${label} to clipboard!`);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied ${label} to clipboard!`);
      }
    });
  });
}

/* Utility to escape HTML in terminal echo */
function escapeHtml(string) {
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(string).replace(/[&<>"']/g, (s) => entityMap[s]);
}
