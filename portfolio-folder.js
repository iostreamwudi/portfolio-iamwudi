(() => {
  const sectionMarkup = `
    <section id="work" class="portfolio-section project-index-section project-folder-section">
      <div class="section-label project-folder-heading">
        <span>01</span>
        <h2>精选作品</h2>
        <p>两个项目放进同一个作品文件夹：一个面向企业团队，一个面向个人用户。</p>
      </div>
      <div class="project-folder-scene" id="project-folder-cards" data-project-folder>
        <div class="folder-back" aria-hidden="true"></div>
        <a class="folder-project folder-project-servicepilot" href="/projects/servicepilot" aria-label="查看 ServicePilot B 端项目详情">
          <div class="folder-project-cover folder-project-cover--servicepilot" style="background:#fff;"><img src="/servicepilot/servicepilot-logo.png?v=20260909-english-only" alt="ServicePilot Logo" style="position:relative;z-index:1;width:94%;height:94%;object-fit:contain;" /></div>
          <div class="folder-project-copy">
            <p class="folder-project-kicker">B 端 · AI 工作空间</p>
            <h3>ServicePilot</h3>
            <p>面向企业客服团队的智能 Agent 平台，把知识问答、订单操作与人工接管接进同一个工作流。</p>
            <div class="folder-project-arrow"><span>查看案例</span><span aria-hidden="true">→</span></div>
          </div>
        </a>
        <a class="folder-project folder-project-forge" href="/projects/forge" aria-label="查看 FORGE C 端产品详情">
          <div class="folder-project-cover folder-project-cover--forge" style="background:#080909;"><img src="/forge/forge-logo.png?v=20260910-logo" alt="FORGE Adaptive Fitness Coach Logo" style="position:relative;z-index:1;width:100%;height:100%;object-fit:contain;" /></div>
          <div class="folder-project-copy">
            <p class="folder-project-kicker">C 端 · 个人训练决策系统</p>
            <h3>FORGE</h3>
            <p>把训练、状态与饮食串成闭环，每天给用户一个清晰的行动答案：今天做什么，为什么，下一步是什么。</p>
            <div class="folder-project-arrow"><span>查看案例</span><span aria-hidden="true">→</span></div>
          </div>
        </a>
        <button class="folder-cover" type="button" data-folder-toggle aria-expanded="false" aria-controls="project-folder-cards">
          <span class="folder-cover-label">Selected work</span>
          <span class="folder-cover-hint" data-folder-hint>悬停或点击展开作品卡片</span>
        </button>
      </div>
      <p class="project-folder-note">先看到作品，再打开案例；每张卡片都可以进入独立详情页。</p>
    </section>`;

  const bindFolder = (scene) => {
    const toggle = scene?.querySelector('[data-folder-toggle]');
    if (!scene || !toggle || scene.dataset.folderBound) return;
    scene.dataset.folderBound = 'true';
    const setOpen = (open) => {
      scene.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('[data-folder-hint]')?.replaceChildren(
        document.createTextNode(open ? '点击收起作品卡片' : '悬停或点击展开作品卡片'),
      );
    };
    toggle.addEventListener('click', () => setOpen(!scene.classList.contains('is-open')));
    scene.addEventListener('mouseleave', () => {
      if (window.matchMedia('(hover: hover)').matches && !scene.contains(document.activeElement)) setOpen(false);
    });
    scene.addEventListener('focusout', () => {
      window.requestAnimationFrame(() => {
        if (!scene.contains(document.activeElement)) setOpen(false);
      });
    });
  };

  const install = () => {
    if (location.pathname !== '/' && location.pathname !== '/index.html') return;
    const current = document.querySelector('#work');
    if (!current) return;
    if (!current.classList.contains('project-folder-section')) {
      const template = document.createElement('template');
      template.innerHTML = sectionMarkup;
      current.replaceWith(template.content.firstElementChild);
    }
    bindFolder(document.querySelector('[data-project-folder]'));
  };

  const scheduleInstall = () => {
    window.requestAnimationFrame(() => {
      install();
      window.requestAnimationFrame(install);
    });
  };

  const start = () => {
    scheduleInstall();
    if (window.__portfolioFolderObserver) return;
    window.__portfolioFolderObserver = new MutationObserver(scheduleInstall);
    window.__portfolioFolderObserver.observe(document.body, { childList: true, subtree: true });
  };

  // The homepage can be restored by browser history or re-rendered by Next.js
  // without firing window.load again. Re-install on every return/navigation.
  window.addEventListener('pageshow', start);
  window.addEventListener('popstate', scheduleInstall);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') scheduleInstall();
  });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
