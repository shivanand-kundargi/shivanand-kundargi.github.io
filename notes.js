    // ============================================================
    // In-Browser Notes Manager & GitHub Publisher
    // ============================================================
    (function() {
      const GITHUB_REPO_OWNER = 'shivanand-kundargi';
      const GITHUB_REPO_NAME = 'shivanand-kundargi.github.io';
      const NOTES_FILE_PATH = 'data/notes.json';
      const TOKEN_STORAGE_KEY = 'shivanand_gh_pat';

      let allNotes = [];
      const noteIdFromUrl = new URLSearchParams(window.location.search).get('id');
      const isNotePage = document.body.dataset.page === 'note';
      let searchQuery = '';

      // Elements
      const notesContainer = document.getElementById('notes-container');
      const notesStatus = document.getElementById('notes-status');
      const tocContainer = document.getElementById('notes-toc');
      const categoryOptions = document.getElementById('note-categories');
      const searchInput = document.getElementById('notes-search-input');
      const searchClear = document.getElementById('notes-search-clear');

      // Auth Elements
      const authTriggerBtn = document.getElementById('btn-auth-trigger');
      const newNoteBtn = document.getElementById('btn-new-note');
      const authLockBtn = document.getElementById('btn-auth-lock');
      const authModal = document.getElementById('auth-modal');
      const authForm = document.getElementById('auth-form');
      const ghTokenInput = document.getElementById('gh-token-input');
      const authErrorMsg = document.getElementById('auth-error-msg');

      // Editor Elements
      const editorModal = document.getElementById('editor-modal');
      const editorForm = document.getElementById('note-editor-form');
      const editorModalTitle = document.getElementById('editor-modal-title');
      const editNoteIdInput = document.getElementById('edit-note-id');
      const noteTitleInput = document.getElementById('note-title');
      const noteDateInput = document.getElementById('note-date');
      const notePaperInput = document.getElementById('note-paper');
      const noteVenueInput = document.getElementById('note-venue');
      const notePaperUrlInput = document.getElementById('note-paper-url');
      const noteCategoryInput = document.getElementById('note-category');
      const noteSummaryInput = document.getElementById('note-summary');
      const noteContentInput = document.getElementById('note-content');
      const notePreviewPane = document.getElementById('note-preview-pane');
      const tabWrite = document.getElementById('tab-write');
      const tabPreview = document.getElementById('tab-preview');
      const submitBtn = document.getElementById('btn-submit-note');
      const submitText = document.getElementById('btn-submit-text');
      const submitSpinner = document.getElementById('btn-submit-spinner');
      const publishStatusMsg = document.getElementById('publish-status-msg');

      function getToken() {
        return localStorage.getItem(TOKEN_STORAGE_KEY);
      }

      function isAuthor() {
        return !!getToken();
      }

      function updateAuthUI() {
        const unlocked = isAuthor();
        if (unlocked) {
          authTriggerBtn.style.display = 'none';
          newNoteBtn.style.display = 'inline-flex';
          authLockBtn.style.display = 'inline-flex';
        } else {
          authTriggerBtn.style.display = 'inline-flex';
          newNoteBtn.style.display = 'none';
          authLockBtn.style.display = 'none';
        }
        renderNotes();
      }

      // ── Modal Helper ──────────────────────────────────────────
      function openModal(modal) {
        modal.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
      }

      function closeModal(modal) {
        modal.setAttribute('hidden', '');
        document.body.style.overflow = '';
      }

      document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-close-modal');
          const m = document.getElementById(id);
          if (m) closeModal(m);
        });
      });

      [authModal, editorModal].forEach(m => {
        m.addEventListener('click', (e) => {
          if (e.target === m) closeModal(m);
        });
      });

      // ── Load Notes ────────────────────────────────────────────
      async function loadNotes() {
        try {
          notesStatus.textContent = 'Loading research notes...';
          notesStatus.style.display = 'block';

          // Add cache-busting timestamp so newly committed notes appear quickly
          if (isNotePage && isAuthor()) {
            // Read the committed version while GitHub Pages rebuilds.
            const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${NOTES_FILE_PATH}?ref=main`, {
              headers: { 'Authorization': `token ${getToken()}`, 'Accept': 'application/vnd.github.v3+json' }
            });
            if (res.ok) {
              const file = await res.json();
              allNotes = JSON.parse(decodeURIComponent(escape(atob(file.content.replace(/\n/g, '')))));
            } else {
              const publicRes = await fetch(`data/notes.json?_t=${Date.now()}`);
              if (!publicRes.ok) throw new Error('Could not load notes data');
              allNotes = await publicRes.json();
            }
          } else {
            const res = await fetch(`data/notes.json?_t=${Date.now()}`);
            if (!res.ok) throw new Error('Could not load notes data');
            allNotes = await res.json();
          }
          notesStatus.style.display = 'none';
          buildCategories();
          renderNotes();
        } catch (err) {
          console.error(err);
          notesStatus.innerHTML = 'Unable to load notes. If you just created this page, add your first note using <strong>Author Mode</strong> above.';
        }
      }

      // Categories are named sections, rather than tags or filters.
      function buildCategories() {
        const categories = [...new Set(allNotes.map(note => note.category || 'Uncategorized'))]
          .sort((a, b) => a.localeCompare(b));
        categoryOptions.innerHTML = categories.map(category =>
          `<option value="${escapeHtml(category)}"></option>`).join('');
      }

      // ── Search & Filter ───────────────────────────────────────
      searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value.trim().toLowerCase();
        searchClear.style.display = searchQuery ? 'block' : 'none';
        renderNotes();
      });

      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        searchClear.style.display = 'none';
        renderNotes();
        searchInput.focus();
      });

      // ── Render Notes ──────────────────────────────────────────
      function renderNotes() {
        const filtered = allNotes.filter(note => {
          if (isNotePage) return note.id === noteIdFromUrl;
          return !searchQuery || [note.title, note.paper, note.venue, note.summary,
            note.content, note.category].filter(Boolean).join(' ').toLowerCase().includes(searchQuery);
        });
        tocContainer.innerHTML = '';
        if (filtered.length === 0) {
          notesContainer.innerHTML = `<div class="notes-empty-state">
            <h3>${isNotePage ? 'Note not found' : allNotes.length ? 'No matching notes' : 'No notes yet'}</h3>
            <p>${isNotePage ? 'This note may have been removed. Browse all notes to find another.' : allNotes.length ? 'Try another search.' : 'New notes will appear here, organized by category.'}</p>
            ${isNotePage ? '<a href="notes.html">Browse all notes</a>' : ''}
          </div>`;
          return;
        }
        if (!isNotePage) {
          const categories = [...new Set(filtered.map(note => note.category || 'Uncategorized'))]
            .sort((a, b) => a.localeCompare(b));
          tocContainer.innerHTML = '<h3>Contents</h3><ul>' + categories.map((category, index) =>
            `<li><a href="#category-${index}">${escapeHtml(category)}</a></li>`).join('') + '</ul>';
          notesContainer.innerHTML = categories.map((category, index) => {
            const notes = filtered.filter(note => (note.category || 'Uncategorized') === category)
              .sort((a, b) => (b.date || '').localeCompare(a.date || '') || a.title.localeCompare(b.title));
            return `<section class="notes-category" id="category-${index}" aria-labelledby="category-title-${index}">
              <h3 id="category-title-${index}">${escapeHtml(category)} <span>${notes.length}</span></h3>
              <ol class="notes-chapter-list">${notes.map(note => `<li>
                <div><a class="notes-chapter-title" href="note.html?id=${encodeURIComponent(note.id)}">${escapeHtml(note.title)}</a>
                <p>${escapeHtml(note.summary || '')}</p></div>
                <time>${escapeHtml(note.date || '')}</time>
              </li>`).join('')}</ol>
            </section>`;
          }).join('');
          return;
        }
        document.title = filtered[0].title + ' · Research Notes';
        document.querySelector('.section-heading h2').textContent = filtered[0].title;
        document.querySelector('.notes-subtitle').textContent = filtered[0].category || 'Uncategorized';
        const canonical = document.querySelector('link[rel="canonical"]');
        canonical.href = 'https://shivanandkundargi.com/note.html?id=' + encodeURIComponent(filtered[0].id);
        document.querySelector('meta[property="og:title"]').content = document.title;
        document.querySelector('meta[property="og:url"]').content = canonical.href;
        document.querySelector('meta[name="description"]').content = filtered[0].summary || filtered[0].title;

        const authorMode = isAuthor();
        notesContainer.innerHTML = filtered.map(note => {
          const paperLink = note.paperUrl ? `<a href="${escapeHtml(note.paperUrl)}" class="note-paper-badge" target="_blank" rel="noopener noreferrer">📄 ${escapeHtml(note.paper || 'Paper')}</a>` : (note.paper ? `<span class="note-paper-badge">📄 ${escapeHtml(note.paper)}</span>` : '');
          const venueHtml = note.venue ? `<span class="note-venue-badge">${escapeHtml(note.venue)}</span>` : '';

          const authorControls = authorMode ? `
            <div class="note-author-actions">
              <button type="button" class="btn-note-edit" data-edit-id="${escapeHtml(note.id)}" title="Edit Note">✏️ Edit</button>
              <button type="button" class="btn-note-delete" data-delete-id="${escapeHtml(note.id)}" title="Delete Note">🗑️ Delete</button>
            </div>
          ` : '';

          return `
            <article class="note-card animate-in visible" id="${escapeHtml(note.id)}">
              <div class="note-card-top">
                <div class="note-meta-badges">
                  <span class="note-date">${escapeHtml(note.date || '')}</span>
                  ${venueHtml}
                  ${paperLink}
                </div>
                ${authorControls}
              </div>

              <p class="note-summary"><strong>Key Takeaway:</strong> ${escapeHtml(note.summary || '')}</p>

              <div class="note-content-rendered" id="content-${escapeHtml(note.id)}">
                ${renderMarkdown(note.content || '')}
              </div>
            </article>
          `;
        }).join('');

        // Apply KaTeX math rendering to all rendered note cards
        if (window.renderMathInElement) {
          renderMathInElement(notesContainer, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ],
            throwOnError: false
          });
        }

        // Attach Edit / Delete Listeners
        if (authorMode) {
          document.querySelectorAll('[data-edit-id]').forEach(btn => {
            btn.addEventListener('click', () => {
              const id = btn.getAttribute('data-edit-id');
              openEditorForEdit(id);
            });
          });

          document.querySelectorAll('[data-delete-id]').forEach(btn => {
            btn.addEventListener('click', () => {
              const id = btn.getAttribute('data-delete-id');
              deleteNote(id);
            });
          });
        }
      }

      function escapeHtml(str) {
        if (!str) return '';
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      }

      function renderMarkdown(md) {
        if (window.marked && typeof marked.parse === 'function') {
          return marked.parse(md);
        }
        return escapeHtml(md).replace(/\n/g, '<br>');
      }

      // ── Auth Interactions ─────────────────────────────────────
      authTriggerBtn.addEventListener('click', () => {
        authErrorMsg.style.display = 'none';
        ghTokenInput.value = '';
        openModal(authModal);
        ghTokenInput.focus();
      });

      authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = ghTokenInput.value.trim();
        if (!token) return;

        authErrorMsg.style.display = 'none';
        const submitBtn = document.getElementById('btn-save-token');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Verifying with GitHub...';

        try {
          // Verify token has access to this repository
          const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`, {
            headers: {
              'Authorization': `token ${token}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });

          if (!res.ok) {
            throw new Error('Token verification failed. Please ensure the token has access to ' + GITHUB_REPO_OWNER + '/' + GITHUB_REPO_NAME);
          }

          localStorage.setItem(TOKEN_STORAGE_KEY, token);
          closeModal(authModal);
          updateAuthUI();
        } catch (err) {
          authErrorMsg.textContent = err.message || 'Invalid token';
          authErrorMsg.style.display = 'block';
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Save & Unlock';
        }
      });

      authLockBtn.addEventListener('click', () => {
        if (confirm('Lock Author Mode? Your token will be cleared from this browser.')) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          updateAuthUI();
        }
      });

      // ── Note Composer Interactions ────────────────────────────
      newNoteBtn.addEventListener('click', () => {
        editorModalTitle.textContent = 'Create New Research Note';
        editNoteIdInput.value = '';
        editorForm.reset();
        noteDateInput.value = new Date().toISOString().split('T')[0];
        notePreviewPane.style.display = 'none';
        noteContentInput.style.display = 'block';
        tabWrite.classList.add('active');
        tabPreview.classList.remove('active');
        publishStatusMsg.style.display = 'none';
        openModal(editorModal);
        noteTitleInput.focus();
      });

      function openEditorForEdit(noteId) {
        const note = allNotes.find(n => n.id === noteId);
        if (!note) return;

        editorModalTitle.textContent = 'Edit Research Note';
        editNoteIdInput.value = note.id;
        noteTitleInput.value = note.title || '';
        noteDateInput.value = note.date || new Date().toISOString().split('T')[0];
        notePaperInput.value = note.paper || '';
        noteVenueInput.value = note.venue || '';
        notePaperUrlInput.value = note.paperUrl || '';
        noteCategoryInput.value = note.category || '';
        noteSummaryInput.value = note.summary || '';
        noteContentInput.value = note.content || '';

        notePreviewPane.style.display = 'none';
        noteContentInput.style.display = 'block';
        tabWrite.classList.add('active');
        tabPreview.classList.remove('active');
        publishStatusMsg.style.display = 'none';

        openModal(editorModal);
        noteTitleInput.focus();
      }

      // Tab toggling (Write vs Preview)
      tabWrite.addEventListener('click', () => {
        tabWrite.classList.add('active');
        tabPreview.classList.remove('active');
        noteContentInput.style.display = 'block';
        notePreviewPane.style.display = 'none';
      });

      tabPreview.addEventListener('click', () => {
        tabPreview.classList.add('active');
        tabWrite.classList.remove('active');
        noteContentInput.style.display = 'none';
        notePreviewPane.style.display = 'block';

        const raw = noteContentInput.value;
        notePreviewPane.innerHTML = renderMarkdown(raw);
        if (window.renderMathInElement) {
          renderMathInElement(notePreviewPane, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ],
            throwOnError: false
          });
        }
      });

      // ── GitHub API Committer ──────────────────────────────────
      editorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = getToken();
        if (!token) {
          alert('You must unlock Author Mode with your token first.');
          return;
        }

        if (!noteCategoryInput.value.trim()) {
          noteCategoryInput.setCustomValidity('Enter a category name.');
          noteCategoryInput.reportValidity();
          return;
        }
        const isEdit = !!editNoteIdInput.value;
        const noteId = isEdit ? editNoteIdInput.value : createSlug(noteTitleInput.value);

        const newNote = {
          id: noteId,
          title: noteTitleInput.value.trim(),
          date: noteDateInput.value || new Date().toISOString().split('T')[0],
          paper: notePaperInput.value.trim(),
          venue: noteVenueInput.value.trim(),
          paperUrl: notePaperUrlInput.value.trim(),
          category: noteCategoryInput.value.trim(),
          summary: noteSummaryInput.value.trim(),
          content: noteContentInput.value.trim()
        };

        setPublishing(true, 'Connecting to GitHub repository...');

        try {
          // 1. Fetch existing data/notes.json file to retrieve SHA and latest content
          const fileRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${NOTES_FILE_PATH}`, {
            headers: {
              'Authorization': `token ${token}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });

          let currentNotes = [];
          let fileSha = null;

          if (fileRes.ok) {
            const fileData = await fileRes.json();
            fileSha = fileData.sha;
            // Decode base64 to utf-8
            const rawContent = decodeURIComponent(escape(atob(fileData.content.replace(/\n/g, ''))));
            currentNotes = JSON.parse(rawContent);
          } else if (fileRes.status === 404) {
            currentNotes = [];
          } else {
            throw new Error(`GitHub API error (${fileRes.status}): ${await fileRes.text()}`);
          }

          // 2. Insert or update the note
          if (isEdit) {
            const idx = currentNotes.findIndex(n => n.id === noteId);
            if (idx >= 0) {
              currentNotes[idx] = newNote;
            } else {
              currentNotes.unshift(newNote);
            }
          } else {
            currentNotes.unshift(newNote);
          }

          setPublishing(true, 'Committing note to main branch...');

          // 3. Commit back to GitHub
          const updatedJsonString = JSON.stringify(currentNotes, null, 2);
          const encodedContent = btoa(unescape(encodeURIComponent(updatedJsonString)));

          const commitMsg = isEdit ? `Update note: ${newNote.title}` : `Add note: ${newNote.title}`;

          const putRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${NOTES_FILE_PATH}`, {
            method: 'PUT',
            headers: {
              'Authorization': `token ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
              message: commitMsg,
              content: encodedContent,
              sha: fileSha || undefined,
              branch: 'main'
            })
          });

          if (!putRes.ok) {
            const errJson = await putRes.json();
            throw new Error(errJson.message || 'Failed to commit note to GitHub');
          }

          // 4. Update local state immediately so author sees it instantly
          allNotes = currentNotes;
          buildCategories();
          renderNotes();

          publishStatusMsg.className = 'publish-status success';
          publishStatusMsg.textContent = '✨ Note committed successfully! GitHub Pages will build in ~1 minute.';
          publishStatusMsg.style.display = 'block';

          setTimeout(() => {
            closeModal(editorModal);
            setPublishing(false);
            window.location.href = 'note.html?id=' + encodeURIComponent(noteId);
          }, 1200);

        } catch (err) {
          console.error(err);
          publishStatusMsg.className = 'publish-status error';
          publishStatusMsg.textContent = 'Error publishing note: ' + err.message;
          publishStatusMsg.style.display = 'block';
          setPublishing(false);
        }
      });

      // ── Delete Note ───────────────────────────────────────────
      async function deleteNote(noteId) {
        const note = allNotes.find(n => n.id === noteId);
        if (!note) return;

        if (!confirm(`Are you sure you want to delete note "${note.title}"? This will commit the removal to GitHub.`)) {
          return;
        }

        const token = getToken();
        if (!token) {
          alert('You must unlock Author Mode with your token first.');
          return;
        }

        try {
          notesStatus.textContent = 'Deleting note and committing to GitHub...';
          notesStatus.style.display = 'block';

          const fileRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${NOTES_FILE_PATH}`, {
            headers: {
              'Authorization': `token ${token}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });

          if (!fileRes.ok) throw new Error('Could not fetch current repository data.');
          const fileData = await fileRes.json();
          const rawContent = decodeURIComponent(escape(atob(fileData.content.replace(/\n/g, ''))));
          const currentNotes = JSON.parse(rawContent);

          const updatedNotes = currentNotes.filter(n => n.id !== noteId);
          const updatedJsonString = JSON.stringify(updatedNotes, null, 2);
          const encodedContent = btoa(unescape(encodeURIComponent(updatedJsonString)));

          const putRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${NOTES_FILE_PATH}`, {
            method: 'PUT',
            headers: {
              'Authorization': `token ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
              message: `Delete note: ${note.title}`,
              content: encodedContent,
              sha: fileData.sha,
              branch: 'main'
            })
          });

          if (!putRes.ok) throw new Error('Failed to commit deletion to GitHub.');

          if (isNotePage) {
            window.location.href = 'notes.html';
            return;
          }
          allNotes = updatedNotes;
          notesStatus.style.display = 'none';
          buildCategories();
          renderNotes();
        } catch (err) {
          alert('Error deleting note: ' + err.message);
          notesStatus.style.display = 'none';
        }
      }

      function createSlug(text) {
        return (text || 'note')
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '') + '-' + crypto.randomUUID();
      }

      function setPublishing(isPublishing, msg) {
        submitBtn.disabled = isPublishing;
        submitSpinner.style.display = isPublishing ? 'inline-block' : 'none';
        submitText.textContent = isPublishing ? (msg || 'Publishing...') : 'Publish & Commit to GitHub';
        if (isPublishing && msg) {
          publishStatusMsg.className = 'publish-status info';
          publishStatusMsg.textContent = msg;
          publishStatusMsg.style.display = 'block';
        }
      }

      noteCategoryInput.addEventListener('input', () => noteCategoryInput.setCustomValidity(''));

      // Initial load
      updateAuthUI();
      loadNotes();
    })();
