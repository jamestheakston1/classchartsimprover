const NOTES_STORAGE_KEY = 'classcharts_personal_notes';
const GOALS_STORAGE_KEY = 'classcharts_personal_goals';
const PROFILE_PHOTO_STORAGE_KEY = 'classcharts_custom_profile_photo';
const WELCOME_SHOWN_KEY = 'classcharts_improver_welcome_shown_v4';
const IMPROVED_UI_KEY = 'classcharts_improver_improved_ui_enabled';
const PLUS_ONE_ICON_KEY = 'classcharts_improver_plus_one_icon';

const MESSAGE_MENU_SELECTOR = '.MuiButtonBase-root.MuiListItem-root.desktop-drawer-pupil-menu-item:last-child';
const PRIMARY_BLUE = '#039BE5';
const LIGHT_GREY = '#f5f5f5';

// Define the correct ClassCharts Green for positive points/badges
const POSITIVE_GREEN = '#4CAF50'; 

const NOTES_ICON_FILE = 'edit-3.svg';
const GOALS_ICON_FILE = 'target.svg';
const INFO_ICON_FILE = 'info.svg';
const CAMERA_ICON_FILE = 'camera.svg';
const SETTINGS_ICON_FILE = 'settings.svg';
const POSITIVE_ICON_FILE = 'smile.svg'; 

const PROFILE_IMAGE_DEFAULT_SRC_PATTERN = 'faces/';
const CLASSCHARTS_DEFAULT_PHOTO_URL = 'https://195ec04504ea0272771e-7c2c6dacbab7a2b2d574b53c70c1fe31.ssl.cf3.rackcdn.com/29.67.5-52f0ea22/img/faces/default.png';

const DEFAULT_MENU_MAPPING = {
    0: 'home.svg',
    1: 'share-2.svg',
    2: 'clipboard.svg',
    3: 'clock.svg',
    4: 'calendar.svg',
    5: 'smile.svg',
    6: 'bar-chart-2.svg',
    7: 'alert-triangle.svg',
    8: 'message-square.svg'
};

const DEFAULT_MENU_TEXT_MAPPING = {
    0: 'Overview',
    2: 'Homework',
    4: 'Timetable',
    5: 'Wellbeing',
    8: 'Messages'
};

function loadNotes() {
    return localStorage.getItem(NOTES_STORAGE_KEY) || '';
}

function saveNotes(notes) {
    localStorage.setItem(NOTES_STORAGE_KEY, notes);
}

function loadGoals() {
    try {
        const stored = localStorage.getItem(GOALS_STORAGE_KEY);
        const goals = stored ? JSON.parse(stored) : [];
        return goals.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            return b.createdAt - a.createdAt;
        });
    } catch (e) {
        return [];
    }
}

function saveGoals(goals) {
    try {
        localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals || []));
    } catch (e) {
    }
}

function loadCustomProfilePhoto() {
    return localStorage.getItem(PROFILE_PHOTO_STORAGE_KEY);
}

function getImprovedUIStatus() {
    return true;
}

function getPlusOneIcon() {
    return localStorage.getItem(PLUS_ONE_ICON_KEY) || 'smile.svg';
}

function setPlusOneIcon(icon) {
    localStorage.setItem(PLUS_ONE_ICON_KEY, icon);
}

function updateAllMenuIcons() {
    updateDefaultIcons();
    const menuItems = document.querySelectorAll('.desktop-drawer-pupil-menu-item');
    const noteItem = Array.from(menuItems).find(item => item.querySelector('.MuiListItemText-primary')?.textContent === 'Personal Notes');
    const goalsItem = Array.from(menuItems).find(item => item.querySelector('.MuiListItemText-primary')?.textContent === 'Goals Tracker');
    const aboutItem = Array.from(menuItems).find(item => item.querySelector('.MuiListItemText-primary')?.textContent === 'About');
    const photoItem = Array.from(menuItems).find(item => item.querySelector('.MuiListItemText-primary')?.textContent === 'Upload Custom Profile Photo');
    const settingsItem = Array.from(menuItems).find(item => item.querySelector('.MuiListItemText-primary')?.textContent === 'More Appearance Settings');

    if (noteItem) replaceIcon(noteItem, NOTES_ICON_FILE);
    if (goalsItem) replaceIcon(goalsItem, GOALS_ICON_FILE);
    if (aboutItem) replaceIcon(aboutItem, INFO_ICON_FILE);
    if (photoItem) replaceIcon(photoItem, CAMERA_ICON_FILE);
    if (settingsItem) replaceIcon(settingsItem, SETTINGS_ICON_FILE);
}

const getAssetUrl = (filename) => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL && chrome.runtime.id) {
        if (filename === 'customlogo.png' || filename === 'threadtutorial.png') {
             return chrome.runtime.getURL(`assets/${filename}`);
        }
        return chrome.runtime.getURL(`assets/feather/${filename}`);
    }
    return filename;
};

function replaceClassChartsLogo() {
    const mainLogo = document.querySelector('img[src*="CC_logo.png"], img[alt="Logo"]');
    if (mainLogo) {
        mainLogo.src = getAssetUrl('customlogo.png');
        mainLogo.alt = 'ClassCharts Improver Logo';
    }
}

function applyImprovedUI(enabled) {
    const body = document.body;
    if (enabled) {
        body.classList.add('cc-improver-improved-ui');
        const style = document.createElement('style');
        style.id = 'cc-improver-ui-styles';
        style.textContent = `
            .cc-improver-improved-ui .MuiPaper-root {
                border-radius: 12px !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            }
            .cc-improver-improved-ui .MuiAppBar-root {
                box-shadow: none !important;
                border-bottom: 1px solid #ddd;
            }
            .cc-improver-improved-ui .MuiCardHeader-root {
                border-bottom: 1px solid #f0f0f0;
            }
        `;
        document.head.appendChild(style);
    } else {
        body.classList.remove('cc-improver-improved-ui');
        const style = document.getElementById('cc-improver-ui-styles');
        if (style) style.remove();
    }
}

function replaceIcon(element, iconFile) {
    const iconContainer = element.querySelector('.MuiListItemIcon-root');
    if (!iconContainer) return;
    const injectedIconSelector = '.cc-improver-icon-img';
    let injectedIcon = iconContainer.querySelector(injectedIconSelector);
    const originalIcon = iconContainer.querySelector(':scope > *:not(' + injectedIconSelector + ')');
    
    if (getImprovedUIStatus()) {
        if (originalIcon) {
             if (originalIcon.style.display !== 'none') {
                originalIcon.setAttribute('data-cc-improver-original-display', originalIcon.style.display || '');
                originalIcon.style.display = 'none';
             }
        }
        if (!injectedIcon) {
            const iconUrl = getAssetUrl(iconFile);
            const img = document.createElement('img');
            img.src = iconUrl;
            img.alt = 'icon';
            img.className = 'cc-improver-icon-img';
            img.style.cssText = 'width:24px;height:24px; color: currentColor;';
            iconContainer.appendChild(img);
        } else {
            injectedIcon.src = getAssetUrl(iconFile);
            injectedIcon.style.display = '';
        }
    } else {
        if (injectedIcon) {
            injectedIcon.remove();
        }
        if (originalIcon && originalIcon.hasAttribute('data-cc-improver-original-display')) {
            originalIcon.style.display = originalIcon.getAttribute('data-cc-improver-original-display');
            originalIcon.removeAttribute('data-cc-improver-original-display');
        }
    }
}

function updateDefaultIcons() {
    const defaultMenuItems = document.querySelectorAll('.MuiButtonBase-root.MuiListItem-root.desktop-drawer-pupil-menu-item');
    defaultMenuItems.forEach((item, index) => {
        const iconFile = DEFAULT_MENU_MAPPING[index];
        const newText = DEFAULT_MENU_TEXT_MAPPING[index];
        if (iconFile) {
            replaceIcon(item, iconFile);
        }
        if (newText) {
            const textSpan = item.querySelector('.MuiListItemText-primary');
            if (textSpan) {
                textSpan.textContent = newText;
            }
        }
    });
}

function createMenuItem() {
    const messagesItem = document.querySelector(MESSAGE_MENU_SELECTOR);
    if (!messagesItem) {
        return false;
    }
    
    const createItem = (text, iconFile, clickHandler, id) => {
        const item = messagesItem.cloneNode(true);
        item.id = id;
        const textSpan = item.querySelector('.MuiListItemText-primary');
        if (textSpan) {
            textSpan.textContent = text;
            item.style.backgroundColor = 'transparent';
            item.style.color = 'rgba(0, 0, 0, 0.87)';
            item.addEventListener('mouseover', () => {
                item.style.backgroundColor = 'rgba(0, 0, 0, 0.04)';
            });
            item.addEventListener('mouseout', () => {
                item.style.backgroundColor = 'transparent';
            });
            replaceIcon(item, iconFile);
            item.removeEventListener('click', item.click);
            item.addEventListener('click', clickHandler);
        }
        return item;
    };
    
    // 1. Personal Notes
    const notesItem = createItem('Personal Notes', NOTES_ICON_FILE, (event) => {
        event.preventDefault();
        event.stopPropagation();
        showNotesModal();
    }, 'cc-improver-notes-menu-item');

    // 2. Goals Tracker
    const goalsItem = createItem('Goals Tracker', GOALS_ICON_FILE, (event) => {
        event.preventDefault();
        event.stopPropagation();
        showGoalsModal();
    }, 'cc-improver-goals-menu-item');

    // 3. About
    const aboutItem = createItem('About', INFO_ICON_FILE, (event) => {
        event.preventDefault();
        event.stopPropagation();
        showAboutModal();
    }, 'cc-improver-about-menu-item');

    // 4. Upload Custom Profile Photo
    const profilePhotoItem = createItem('Upload Custom Profile Photo', CAMERA_ICON_FILE, (event) => {
        event.preventDefault();
        event.stopPropagation();
        showProfilePhotoModal();
    }, 'cc-improver-custom-photo-menu-item');
    
    // 5. More Appearance Settings (NEW)
    const settingsItem = createItem('More Appearance Settings', SETTINGS_ICON_FILE, (event) => {
        event.preventDefault();
        event.stopPropagation();
        showAppearanceSettingsModal();
    }, 'cc-improver-settings-menu-item');


    const improverHeaderHtml = `
        <div class="cc-improver-header" style="padding: 16px; padding-bottom: 8px; font-weight: 700; color: rgba(0, 0, 0, 0.54); font-size: 0.875rem; text-transform: uppercase;">
            ClassCharts Improver
        </div>
        <div class="cc-improver-divider" style="height: 1px; background-color: rgba(0, 0, 0, 0.12); margin: 0 16px;"></div>
    `;

    const appearanceHeaderHtml = `
        <div class="cc-improver-header cc-improver-appearance-header" style="padding: 16px; padding-bottom: 8px; font-weight: 700; color: rgba(0, 0, 0, 0.54); font-size: 0.875rem; text-transform: uppercase;">
            Appearance
        </div>
        <div class="cc-improver-divider" style="height: 1px; background-color: rgba(0, 0, 0, 0.12); margin: 0 16px;"></div>
    `;
    
    const finalDividerHtml = `<div class="cc-improver-divider" style="height: 1px; background-color: rgba(0, 0, 0, 0.12); margin: 0 16px;"></div>`;

    // Insertion Logic
    messagesItem.after(notesItem);
    notesItem.after(goalsItem);
    notesItem.insertAdjacentHTML('beforebegin', improverHeaderHtml);
    goalsItem.after(aboutItem);
    
    // Insert appearance section
    aboutItem.insertAdjacentHTML('afterend', finalDividerHtml);
    const firstDividerAfterAbout = aboutItem.nextElementSibling;
    firstDividerAfterAbout.insertAdjacentHTML('afterend', appearanceHeaderHtml);
    const appearanceHeader = firstDividerAfterAbout.nextElementSibling;
    
    // Insert appearance items
    appearanceHeader.insertAdjacentElement('afterend', profilePhotoItem);
    profilePhotoItem.insertAdjacentElement('afterend', settingsItem);
    settingsItem.insertAdjacentHTML('afterend', finalDividerHtml);

    return true;
}

function createBaseModal(idPrefix, title, bodyHtml, maxWidth = '500px') {
    const modalHtml = `
        <style>
            .${idPrefix}-modal-card {
                background-color: white;
                border-radius: 12px;
                width: 90%;
                max-width: ${maxWidth};
                box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
                font-family: Inter, Roboto, "Helvetica Neue", Arial, sans-serif;
                overflow: hidden;
            }
            .${idPrefix}-modal-header {
                padding: 18px 24px;
                font-size: 1.5rem;
                font-weight: 600;
                color: #212121;
                border-bottom: 1px solid #e0e0e0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: #f7f7f7;
            }
            .${idPrefix}-modal-body {
                padding: 24px;
            }
            .${idPrefix}-close-x {
                 background: none;
                 border: none;
                 font-size: 2rem;
                 cursor: pointer;
                 color: rgba(0, 0, 0, 0.54);
                 line-height: 1;
                 transition: color 0.2s;
            }
            .${idPrefix}-close-x:hover {
                 color: rgba(0, 0, 0, 0.87);
            }
            .${idPrefix}-button {
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                transition: background-color 0.2s, box-shadow 0.2s, transform 0.1s;
                min-width: 100px;
            }
            .${idPrefix}-button:active {
                transform: scale(0.98);
            }
            .${idPrefix}-save-btn {
                background-color: ${PRIMARY_BLUE};
                color: white;
                box-shadow: 0 4px 8px rgba(3,155,229,0.4);
            }
            .${idPrefix}-save-btn:hover {
                background-color: #0277BD;
            }
            .${idPrefix}-cancel-btn {
                background-color: #e0e0e0;
                color: rgba(0, 0, 0, 0.87);
            }
            .${idPrefix}-cancel-btn:hover {
                background-color: #bdbdbd;
            }
            .cc-notes-textarea, .cc-notes-display-content, .cc-add-goal-input {
                width: 100%;
                min-height: 250px;
                border: 2px solid #ddd;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 20px;
                font-family: inherit;
                font-size: 1rem;
                outline: none;
                transition: border-color 0.3s, box-shadow 0.3s;
                box-sizing: border-box;
                white-space: pre-wrap;
            }
            .cc-notes-textarea:focus, .cc-add-goal-input:focus {
                border-color: ${PRIMARY_BLUE};
                box-shadow: 0 0 0 3px rgba(3,155,229,0.2);
            }
            .cc-notes-display-content {
                min-height: 150px;
                background-color: ${LIGHT_GREY};
            }
            .cc-goal-list {
                list-style: none;
                padding: 0;
                max-height: 300px;
                overflow-y: auto;
                margin-bottom: 20px;
                border: 1px solid #f0f0f0;
                border-radius: 8px;
                background-color: #fff;
            }
            .cc-goal-item {
                display: flex;
                align-items: center;
                padding: 12px 16px;
                border-bottom: 1px solid #eee;
            }
            .cc-goal-item:last-child {
                border-bottom: none;
            }
            .cc-goal-item.completed {
                color: rgba(0, 0, 0, 0.4);
                text-decoration: line-through;
            }
            .cc-goal-checkbox {
                appearance: none;
                -webkit-appearance: none;
                width: 20px;
                height: 20px;
                border: 2px solid ${PRIMARY_BLUE};
                border-radius: 4px;
                margin-right: 15px;
                cursor: pointer;
                position: relative;
                transition: background-color 0.2s, border-color 0.2s;
                min-width: 20px;
            }
            .cc-goal-checkbox:checked {
                background-color: ${PRIMARY_BLUE};
                border-color: ${PRIMARY_BLUE};
            }
            .cc-goal-checkbox:checked::after {
                content: '';
                position: absolute;
                left: 6px;
                top: 2px;
                width: 5px;
                height: 10px;
                border: solid white;
                border-width: 0 3px 3px 0;
                transform: rotate(45deg);
            }
            .cc-goal-text {
                flex-grow: 1;
                font-size: 1rem;
            }
            .cc-add-goal-container {
                display: flex;
                gap: 10px;
                margin-top: 16px;
            }
            .cc-add-goal-input {
                flex-grow: 1;
                min-height: unset;
                height: 48px;
                padding: 10px 16px;
                margin-bottom: 0;
            }
        </style>
        <div id="${idPrefix}-modal-backdrop" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); z-index: 1300; display: flex; justify-content: center; align-items: center; opacity: 0; transition: opacity 0.3s;">
            <div id="${idPrefix}-modal-content" class="${idPrefix}-modal-card">
                <div class="${idPrefix}-modal-header">
                    ${title}
                    <button id="${idPrefix}-close-x" class="${idPrefix}-close-x">&times;</button>
                </div>
                <div class="${idPrefix}-modal-body">
                    ${bodyHtml}
                </div>
            </div>
        </div>
    `;
    const existingModal = document.getElementById(`${idPrefix}-modal-backdrop`);
    if (existingModal) existingModal.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const backdrop = document.getElementById(`${idPrefix}-modal-backdrop`);
    const closeXBtn = document.getElementById(`${idPrefix}-close-x`);
    
    // Show modal with transition
    setTimeout(() => {
        backdrop.style.opacity = '1';
    }, 10);
    
    const closeModal = () => {
        backdrop.style.opacity = '0';
        setTimeout(() => {
            backdrop.remove();
        }, 300);
    };
    
    closeXBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (event) => {
        if (event.target === backdrop) {
            closeModal();
        }
    });
    return { closeModal };
}

function showNotesModal() {
    const bodyHtml = `
        <div id="cc-notes-display" class="cc-notes-display-content">
        </div>
        <textarea id="cc-notes-textarea" class="cc-notes-textarea" placeholder="Write your notes here..." style="display: none;"></textarea>
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button id="cc-notes-close-modal-btn" class="cc-notes-button cc-notes-cancel-btn">Close</button>
            <button id="cc-notes-edit-btn" class="cc-notes-button cc-notes-save-btn">Edit Notes</button>
            <button id="cc-notes-cancel-edit-btn" class="cc-notes-button cc-notes-cancel-btn" style="display: none;">Cancel Edit</button>
            <button id="cc-notes-save-btn" class="cc-notes-button cc-notes-save-btn" style="display: none;">Save Changes</button>
        </div>
    `;
    const { closeModal } = createBaseModal('cc-notes', 'Personal Notes', bodyHtml);
    const textarea = document.getElementById('cc-notes-textarea');
    const displayDiv = document.getElementById('cc-notes-display');
    const closeModalBtn = document.getElementById('cc-notes-close-modal-btn');
    const editBtn = document.getElementById('cc-notes-edit-btn');
    const saveBtn = document.getElementById('cc-notes-save-btn');
    const cancelEditBtn = document.getElementById('cc-notes-cancel-edit-btn');
    const initialNotes = loadNotes();
    let currentNotes = initialNotes;
    
    const setMode = (editing) => {
        if (editing) {
            displayDiv.style.display = 'none';
            textarea.style.display = 'block';
            editBtn.style.display = 'none';
            closeModalBtn.style.display = 'none';
            cancelEditBtn.style.display = 'block';
            saveBtn.style.display = 'block';
            textarea.focus();
        } else {
            displayDiv.style.display = 'block';
            textarea.style.display = 'none';
            editBtn.style.display = 'block';
            closeModalBtn.style.display = 'block';
            cancelEditBtn.style.display = 'none';
            saveBtn.style.display = 'none';
        }
    };
    
    const updateContent = (content) => {
        displayDiv.textContent = content.length > 0 ? content : 'No notes saved yet. Click Edit Notes to start.';
        textarea.value = content;
        currentNotes = content;
    };
    
    updateContent(initialNotes);
    setMode(false);
    
    closeModalBtn.addEventListener('click', closeModal);
    editBtn.addEventListener('click', () => {
        setMode(true);
    });
    cancelEditBtn.addEventListener('click', () => {
         textarea.value = currentNotes;
         setMode(false);
    });
    saveBtn.addEventListener('click', () => {
        const newNotes = textarea.value;
        saveNotes(newNotes);
        updateContent(newNotes);
        setMode(false);
    });
}

function showGoalsModal() {
    const bodyHtml = `
        <div style="font-size: 0.9rem; color: rgba(0, 0, 0, 0.6); margin-bottom: 10px;">Your pending and completed goals:</div>
        <ul id="cc-goal-list" class="cc-goal-list"></ul>
        <div class="cc-add-goal-container">
            <input type="text" id="cc-add-goal-input" class="cc-add-goal-input" placeholder="Enter new goal (e.g., 'Revise Maths topic 3')">
            <button id="cc-add-goal-btn" class="cc-goals-button cc-goals-save-btn" style="white-space: nowrap;">Add Goal</button>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 30px;">
            <button id="cc-goals-clear-btn" class="cc-goals-button cc-goals-cancel-btn">Clear Completed</button>
            <button id="cc-goals-close-btn" class="cc-notes-button cc-notes-save-btn">Close</button>
        </div>
    `;
    const { closeModal } = createBaseModal('cc-goals', 'Goals Tracker', bodyHtml);
    const goalsList = document.getElementById('cc-goal-list');
    const input = document.getElementById('cc-add-goal-input');
    const addBtn = document.getElementById('cc-add-goal-btn');
    const clearBtn = document.getElementById('cc-goals-clear-btn');
    const closeBtn = document.getElementById('cc-goals-close-btn');
    
    let currentGoals = loadGoals();

    const renderGoals = () => {
        goalsList.innerHTML = '';
        currentGoals = loadGoals();
        if (currentGoals.length === 0) {
            goalsList.innerHTML = '<li style="padding: 10px 16px; color: rgba(0,0,0,0.5);">No goals set yet. Use the input below to add your first goal!</li>';
            return;
        }
        
        currentGoals.forEach(goal => {
            const listItem = document.createElement('li');
            listItem.className = `cc-goal-item ${goal.completed ? 'completed' : ''}`;
            listItem.dataset.id = goal.id;
            listItem.innerHTML = `
                <input type="checkbox" class="cc-goal-checkbox" ${goal.completed ? 'checked' : ''} data-id="${goal.id}">
                <span class="cc-goal-text">${goal.text}</span>
            `;
            goalsList.appendChild(listItem);
        });

        goalsList.querySelectorAll('.cc-goal-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => toggleGoalCompletion(e.target.dataset.id));
        });
    };

    const toggleGoalCompletion = (id) => {
        currentGoals = loadGoals();
        const goalIndex = currentGoals.findIndex(g => g.id === id);
        if (goalIndex !== -1) {
            currentGoals[goalIndex].completed = !currentGoals[goalIndex].completed;
            currentGoals[goalIndex].createdAt = Date.now();
            saveGoals(currentGoals);
            renderGoals();
        }
    };

    const addGoal = () => {
        const text = input.value.trim();
        if (text) {
            const newGoal = {
                id: Date.now().toString(),
                text: text,
                completed: false,
                createdAt: Date.now()
            };
            currentGoals.push(newGoal);
            saveGoals(currentGoals);
            input.value = '';
            renderGoals();
        }
    };

    const clearCompleted = () => {
        currentGoals = loadGoals();
        const incompleteGoals = currentGoals.filter(g => !g.completed);
        saveGoals(incompleteGoals);
        renderGoals();
    };

    addBtn.addEventListener('click', addGoal);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addGoal();
    });
    clearBtn.addEventListener('click', clearCompleted);
    closeBtn.addEventListener('click', closeModal);
    
    renderGoals();
}

function showAboutModal() {
    const bodyHtml = `
        <p style="margin-bottom: 20px; font-size: 1rem; color: #444;">This project enhances the ClassCharts student portal by adding new, helpful features that are stored securely in your browser's local memory.</p>
        <ul style="list-style-type: disc; padding-left: 20px; margin-bottom: 20px; color: #444;">
            <li style="margin-bottom: 8px;"><strong>Version:</strong> 4.0 (Enhanced Styling Release)</li>
            <li style="margin-bottom: 8px;"><strong>Feature 1:</strong> Personal Notes (A private notepad)</li>
            <li><strong>Feature 2:</strong> Goals Tracker (Define and track tasks/goals)</li>
            <li><strong>Feature 3:</strong> Custom Profile Photo (Visible only to you)</li>
        </ul>
        <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
            <p style="font-size: 0.85rem; color: #777; margin-bottom: 10px;">
                <strong>Privacy Notice:</strong> This extension stores all your notes, goals, and data locally in your browser (using localStorage) and does not collect, transmit, or share any personal data with external servers.
            </p>
            <p style="font-size: 0.8rem; color: #999;">
                &copy; James Theakston 2025
            </p>
        </div>
        <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
            <button id="cc-about-close-btn" class="cc-notes-button cc-notes-save-btn">Close</button>
        </div>
    `;
    const { closeModal } = createBaseModal('cc-about', 'About ClassCharts Improver', bodyHtml, '450px');
    const closeBtn = document.getElementById('cc-about-close-btn');
    closeBtn.addEventListener('click', closeModal);
}

function showProfilePhotoModal() {
    const currentPhoto = loadCustomProfilePhoto() || CLASSCHARTS_DEFAULT_PHOTO_URL;
    
    const bodyHtml = `
        <div style="font-size: 1rem; color: #333; margin-bottom: 25px; background-color: #f7f7f7; padding: 15px; border-radius: 8px;">
            <p style="font-weight: 600; color: ${PRIMARY_BLUE}; margin-bottom: 10px;">Your Privacy, Our Priority</p>
            <p>This custom profile photo is <strong>only visible to you</strong> and is stored entirely within your browser's local memory. It will not be shared with your school, teachers, or other students. You can change or remove it anytime.</p>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
            <img id="cc-current-photo-preview" src="${currentPhoto}" 
                 alt="Current Profile Photo" 
                 style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid ${PRIMARY_BLUE};">
            
            <input type="file" id="cc-photo-upload-input" accept="image/*" style="display: none;">
            <button id="cc-photo-upload-btn" class="cc-notes-button cc-notes-save-btn" style="min-width: 180px;">
                Upload New Photo
            </button>
            <button id="cc-photo-remove-btn" class="cc-notes-button cc-goals-cancel-btn" style="min-width: 180px;">
                Remove Photo
            </button>
        </div>
        <div style="display: flex; justify-content: flex-end; margin-top: 30px;">
            <button id="cc-photo-close-btn" class="cc-notes-button cc-goals-cancel-btn">Done</button>
        </div>
    `;
    const { closeModal } = createBaseModal('cc-profile-photo', 'Custom Profile Photo', bodyHtml, '450px');
    const uploadInput = document.getElementById('cc-photo-upload-input');
    const uploadBtn = document.getElementById('cc-photo-upload-btn');
    const removeBtn = document.getElementById('cc-photo-remove-btn');
    const closeBtn = document.getElementById('cc-photo-close-btn');
    const previewImg = document.getElementById('cc-current-photo-preview');

    uploadBtn.addEventListener('click', () => uploadInput.click());
    closeBtn.addEventListener('click', closeModal);
    
    removeBtn.addEventListener('click', () => {
        localStorage.removeItem(PROFILE_PHOTO_STORAGE_KEY);
        applyCustomProfilePhoto();
        previewImg.src = CLASSCHARTS_DEFAULT_PHOTO_URL;
    });

    uploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Image = e.target.result;
            localStorage.setItem(PROFILE_PHOTO_STORAGE_KEY, base64Image);
            applyCustomProfilePhoto();
            previewImg.src = base64Image;
        };
        reader.readAsDataURL(file);
    });
}

function showAppearanceSettingsModal() {
    const currentIcon = getPlusOneIcon();

    const bodyHtml = `
        <div class="space-y-4">
            <h3 style="font-size: 1.1rem; font-weight: 600; color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 15px;">Positive Behavior Icon (The "+1" Icon)</h3>
            <p style="font-size: 0.9rem; color: #555; margin-bottom: 20px;">Choose the icon that appears next to positive behavior points on the dashboard.</p>

            <div style="display: flex; flex-direction: column; gap: 10px;" id="plus-one-icon-options">
                <label style="display: flex; align-items: center; padding: 10px; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; background-color: ${currentIcon === 'default' ? LIGHT_GREY : 'white'};">
                    <input type="radio" name="plusOneIcon" value="default" style="margin-right: 15px; transform: scale(1.2);" ${currentIcon === 'default' ? 'checked' : ''}>
                    <span style="font-weight: 500;">Original Icon (The default ClassCharts look)</span>
                </label>

                <label style="display: flex; align-items: center; padding: 10px; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; background-color: ${currentIcon === 'smile.svg' ? LIGHT_GREY : 'white'};">
                    <input type="radio" name="plusOneIcon" value="smile.svg" style="margin-right: 15px; transform: scale(1.2);" ${currentIcon === 'smile.svg' ? 'checked' : ''}>
                    <img src="${getAssetUrl('smile.svg')}" alt="Smile Icon" style="width: 20px; height: 20px; margin-right: 10px;">
                    <span style="font-weight: 500;">Smile Icon (Recommended)</span>
                </label>

                <label style="display: flex; align-items: center; padding: 10px; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; background-color: ${currentIcon === 'award.svg' ? LIGHT_GREY : 'white'};">
                    <input type="radio" name="plusOneIcon" value="award.svg" style="margin-right: 15px; transform: scale(1.2);" ${currentIcon === 'award.svg' ? 'checked' : ''}>
                    <img src="${getAssetUrl('award.svg')}" alt="Award Icon" style="width: 20px; height: 20px; margin-right: 10px;">
                    <span style="font-weight: 500;">Award Icon</span>
                </label>
            </div>
        </div>
        <div style="display: flex; justify-content: flex-end; margin-top: 30px;">
            <button id="cc-settings-close-btn" class="cc-settings-button cc-settings-save-btn">Close</button>
        </div>
    `;

    const { closeModal } = createBaseModal('cc-settings', 'More Appearance Settings', bodyHtml, '450px');
    const closeBtn = document.getElementById('cc-settings-close-btn');

    closeBtn.addEventListener('click', closeModal);
    
    document.querySelectorAll('input[name="plusOneIcon"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const selectedIcon = e.target.value;
            setPlusOneIcon(selectedIcon);
            updateCustomIcons(); 
            // Update background color visually in the modal
            document.querySelectorAll('label').forEach(label => {
                const input = label.querySelector('input');
                if (input && input.name === 'plusOneIcon') {
                    label.style.backgroundColor = input.value === selectedIcon ? LIGHT_GREY : 'white';
                }
            });
        });
    });
}

function applyCustomProfilePhoto() {
    const customPhotoUrl = loadCustomProfilePhoto();
    // Selector targets the profile photo in the sidebar and other places
    const profileImages = document.querySelectorAll('img.jss32, img[src*="' + PROFILE_IMAGE_DEFAULT_SRC_PATTERN + '"]');

    profileImages.forEach(img => {
        if (!img.dataset.originalSrc && img.src && img.src.includes(PROFILE_IMAGE_DEFAULT_SRC_PATTERN)) {
            img.dataset.originalSrc = img.src;
        }

        if (customPhotoUrl) {
            img.src = customPhotoUrl;
        } else if (img.dataset.originalSrc) {
            img.src = img.dataset.originalSrc;
        }
    });
}

function updateCustomIcons() {
    const iconToUse = getPlusOneIcon();
    
    // Select the elements that represent the '+1' achievement badges
    const achievementSelectors = ['.jss63', '.jss66']; 
    const positiveElements = document.querySelectorAll(achievementSelectors.join(', '));
    // The original style for the badge when it contains the text "+1"
    const originalStyle = 'display: inline-flex; align-items: center; justify-content: center; background-color: #4CAF50; color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 0.75rem; font-weight: bold; padding: 0;';

    positiveElements.forEach(element => {
        const isDefaultMode = iconToUse === 'default';

        if (isDefaultMode) {
            // Restore original appearance if needed
            if (element.dataset.ccImproverIcon) {
                element.innerHTML = '+1';
                element.style.cssText = element.dataset.ccImproverOriginalCss || originalStyle;
                delete element.dataset.ccImproverIcon;
                delete element.dataset.ccImproverOriginalCss;
            }
        } else if (element.textContent.trim() === '+1') {
            const iconUrl = getAssetUrl(iconToUse);
            
            if (!element.dataset.ccImproverIcon) {
                // Store original CSS for restoration later
                element.dataset.ccImproverOriginalCss = element.style.cssText;
            }
            
            element.dataset.ccImproverIcon = 'true';
            
            // Apply new style for the icon replacement
            element.innerHTML = `<img src="${iconUrl}" alt="Achievement Icon" style="width: 18px; height: 18px; margin-right: 2px; margin-top: 1px;">`;
            element.style.cssText = `
                display: flex; 
                align-items: center; 
                justify-content: center; 
                padding: 0;
                background-color: ${POSITIVE_GREEN}; 
                border-radius: 50%;
                width: 20px;
                height: 20px;
                cursor: default;
            `;
        }
    });
}

function replacePositiveAchievementIcons() {
    // This function is now superseded by updateCustomIcons, but we call it to ensure all positive elements are targeted
    updateCustomIcons();
}

function showWelcomeModal() {
    const logoUrl = getAssetUrl('customlogo.png');
    const welcomeHtml = `
        <div id="cc-welcome-modal-backdrop" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); z-index: 1400; display: flex; justify-content: center; align-items: center;">
            <div style="background-color: white; border-radius: 12px; max-width: 450px; padding: 30px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); text-align: center; font-family: Inter, Roboto, sans-serif;">
                <img src="${logoUrl}" alt="ClassCharts Improver Logo" style="width: 64px; height: 64px; margin-bottom: 15px; border-radius: 10px;">
                <h2 style="font-size: 1.5rem; margin-bottom: 10px; color: ${PRIMARY_BLUE}; font-weight: 600;">Welcome to ClassCharts Improver!</h2>
                <p style="font-size: 1rem; color: #444; line-height: 1.5; margin-bottom: 25px;">
                    The improved UI is now enabled, featuring new <strong>Feather icons</strong> across the entire navigation menu and a cleaner card design. You can now use <strong>Personal Notes</strong>, the <strong>Goals Tracker</strong> and set a <strong>Custom Profile Photo</strong> from the side menu.
                </p>
                <button id="cc-welcome-dismiss-btn" style="background-color: ${PRIMARY_BLUE}; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500; text-transform: uppercase; transition: background-color 0.2s;">
                    Got it!
                </button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', welcomeHtml);
    const dismissBtn = document.getElementById('cc-welcome-dismiss-btn');
    const backdrop = document.getElementById('cc-welcome-modal-backdrop');
    const dismiss = () => {
        localStorage.setItem(WELCOME_SHOWN_KEY, 'true');
        backdrop.remove();
    };
    dismissBtn.addEventListener('click', dismiss);
}

function injectReportConcernWarning() {
    const reportConcernPage = document.querySelector('.report-concern-page');
    if (!reportConcernPage) return;
    const header = reportConcernPage.querySelector('h2');
    const injectedClass = 'cc-improver-concern-warning';

    if (header && !reportConcernPage.querySelector('.' + injectedClass)) {
        const iconUrl = getAssetUrl('alert-triangle.svg');
        const warningHtml = `
            <div class="${injectedClass}" style="
                background-color: #fffbeb;
                border-left: 4px solid #f59e0b;
                color: #b45309;
                padding: 12px 16px;
                margin-top: 16px;
                margin-bottom: 24px;
                border-radius: 6px;
                display: flex;
                align-items: center;
            ">
                <img src="${iconUrl}" alt="Warning" style="width: 20px; height: 20px; margin-right: 12px; filter: invert(53%) sepia(85%) saturate(3065%) hue-rotate(334deg) brightness(99%) contrast(92%);">
                <span style="font-size: 0.95rem; font-weight: 500;">
                    This will not be sent to the extension - this will be sent to your school.
                </span>
            </div>
        `;
        header.insertAdjacentHTML('afterend', warningHtml);
    }
}

function injectContactLink() {
    const searchInput = document.querySelector('input[placeholder="Search by teacher name"]');
    const searchInputContainer = searchInput ? searchInput.closest('.MuiInputBase-root.MuiOutlinedInput-root') : null;
    const injectedClass = 'cc-improver-contact-link';

    if (searchInputContainer && !document.querySelector('.' + injectedClass)) {
        const linkHtml = `
            <div class="${injectedClass}" style="
                margin-top: 10px;
                text-align: right;
                font-size: 0.85rem;
                font-family: inherit;
            ">
                <a href="mailto:hi.opticflowstudios@gmail.com" style="color: ${PRIMARY_BLUE}; text-decoration: none; font-weight: 500; transition: color 0.2s;">
                    Contact ClassCharts Improver Extension
                </a>
            </div>
        `;
        searchInputContainer.insertAdjacentHTML('afterend', linkHtml);
    }
}

function injectCodeWarning() {
    const dialogTitleH2 = Array.from(document.querySelectorAll('.MuiDialogTitle-root h2')).find(
        h2 => h2.textContent.trim() === 'My code'
    );
    if (!dialogTitleH2) return;
    const dialogPaper = dialogTitleH2.closest('.MuiDialogTitle-root').parentElement;
    if (dialogPaper.querySelector('.cc-improver-code-warning')) return;
    const dialogContent = dialogPaper.querySelector('.MuiDialogContent-root');
    if (!dialogContent) return;
    
    const warningHtml = `
        <div class="cc-improver-code-warning" style="
            background-color: #fff8e1;
            border-left: 4px solid #ffc107;
            color: #383838;
            padding: 12px 24px;
            margin: 0 24px 20px 24px;
            border-radius: 6px;
            font-size: 0.95rem;
            font-weight: 500;
            display: flex;
            align-items: center;
        ">
            <span style="font-weight: bold; color: #ffc107; font-size: 1.2rem; margin-right: 10px;">&#9888;</span>
            This is like a password - keep it private and safe!
        </div>
    `;

    dialogContent.insertAdjacentHTML('beforebegin', warningHtml);
}

function injectMessagesPlaceholderContent() {
    const placeholderDiv = document.querySelector('.jss53'); 
    const injectedClass = 'cc-improver-messages-guide';
    
    if (placeholderDiv && 
        placeholderDiv.textContent.includes('Please select a thread') &&
        !placeholderDiv.classList.contains(injectedClass)
    ) {
        placeholderDiv.classList.add(injectedClass);
        placeholderDiv.textContent = 'Select a teacher on the left side to view the messages you have exchanged.';
        
        const imgUrl = getAssetUrl('threadtutorial.png');
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = 'Guide showing how to select a teacher thread';
        
        placeholderDiv.style.cssText = 'text-align: center; padding-top: 40px; font-weight: 500; color: #444;';
        img.style.cssText = 'max-width: 100%; height: auto; margin-top: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);';
        
        placeholderDiv.appendChild(img);
    }
}

function injectAnnouncementsDescription() {
    const announcementHeader = document.querySelector('h5.MuiTypography-root.MuiTypography-h5');
    const injectedClass = 'cc-improver-announcements-desc';
    
    if (announcementHeader && 
        announcementHeader.textContent.trim() === 'Announcements' && 
        !announcementHeader.parentElement.querySelector('.' + injectedClass)
    ) {
        const descriptionHtml = `
            <p class="${injectedClass}" style="
                font-size: 0.9rem; 
                color: #777; 
                margin-top: 4px; 
                margin-bottom: 16px; 
                font-weight: 400;
            ">
                View the latest news from your school below.
            </p>
        `;
        
        announcementHeader.insertAdjacentHTML('afterend', descriptionHtml);
    }
}


/**
 * New function to display the confirmation modal for reloading the page.
 */
function showRefreshTweaksModal() {
    const bodyHtml = `
        <div style="font-size: 1rem; color: #333; line-height: 1.5; margin-bottom: 25px;">
            <p>This action will reload the page to restart the ClassCharts Improver extension.</p>
            <p style="margin-top: 10px;">This is useful if you notice any custom tweaks (like icons, notes, or layout changes) not appearing correctly on the current page.</p>
            <p style="margin-top: 15px; font-weight: 600; color: #E53935;">⚠️ Any unsaved work on the ClassCharts page itself (e.g., editing homework) will be lost.</p>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button id="cc-refresh-cancel-btn" class="cc-notes-button cc-notes-cancel-btn">Cancel</button>
            <button id="cc-refresh-continue-btn" class="cc-notes-button cc-notes-save-btn">Continue & Refresh</button>
        </div>
    `;
    const { closeModal } = createBaseModal('cc-refresh-tweaks', 'Refresh Extension Tweaks', bodyHtml, '450px');
    
    document.getElementById('cc-refresh-cancel-btn').addEventListener('click', closeModal);
    document.getElementById('cc-refresh-continue-btn').addEventListener('click', () => {
        window.location.reload();
    });
}


/**
 * New function to inject the "Refresh Tweaks" button to the left of "My code".
 */
function injectRefreshTweaksButton() {
    // Select the target button
    const myCodeButton = document.querySelector('.my-code-button');
    const injectedClass = 'cc-improver-refresh-button';

    if (myCodeButton && !document.querySelector('.' + injectedClass)) {
        // 1. Clone the existing button with all its children (deep clone)
        const refreshButton = myCodeButton.cloneNode(true);
        
        // 2. Add a unique class for future checks
        refreshButton.classList.add(injectedClass);
        
        // 3. Update the button label
        const label = refreshButton.querySelector('.MuiButton-label');
        if (label) {
            label.textContent = 'Refresh Tweaks';
        }
        
        // 4. Set the new click handler
        refreshButton.addEventListener('click', (event) => {
            event.preventDefault(); 
            event.stopPropagation(); 
            showRefreshTweaksModal();
        });
        
        // 5. Insert the new button before the original 'My code' button
        myCodeButton.insertAdjacentElement('beforebegin', refreshButton);
    }
}


function initObserver() {
    let attempts = 0;
    const maxAttempts = 30;

    replaceClassChartsLogo();
    applyImprovedUI(getImprovedUIStatus());
    applyCustomProfilePhoto(); 
    updateCustomIcons();

    const interval = setInterval(() => {
        const menuInjected = document.querySelector('.cc-improver-header');
        
        // Always run these to ensure icons are set and persistent
        updateDefaultIcons();
        updateCustomIcons();
        
        if (!menuInjected) {
            if (createMenuItem()) {
                if (localStorage.getItem(WELCOME_SHOWN_KEY) !== 'true') {
                    showWelcomeModal();
                }
            }
        }

        // Run injections consistently to catch late-loading pages
        injectReportConcernWarning();
        injectContactLink();
        injectCodeWarning();
        injectMessagesPlaceholderContent();
        injectAnnouncementsDescription(); // Re-added this for completeness
        injectRefreshTweaksButton(); // <-- New feature injection

        if (attempts >= maxAttempts) {
            clearInterval(interval);
        }
        attempts++;
    }, 500);
}

initObserver();