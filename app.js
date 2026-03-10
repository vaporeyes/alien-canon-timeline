// ABOUTME: Main application logic for Alien Canon Timeline SPA
// ABOUTME: Handles vertical timeline rendering, filtering, search, and modal interactions

class TimelineApp {
    constructor() {
        this.data = timelineData;
        this.filteredData = [...this.data];
        this.currentFilter = 'all';
        this.currentEventIndex = 0;

        this.elements = {
            filterControls: document.getElementById('filterControls'),
            searchInput: document.getElementById('searchInput'),
            timelineViewport: document.getElementById('timelineViewport'),
            timelineEvents: document.getElementById('timelineEvents'),
            modal: document.getElementById('modal'),
            modalBackdrop: document.getElementById('modalBackdrop'),
            modalClose: document.getElementById('modalClose'),
            modalTitle: document.getElementById('modalTitle'),
            modalMeta: document.getElementById('modalMeta'),
            modalDescription: document.getElementById('modalDescription'),
            modalPrev: document.getElementById('modalPrev'),
            modalNext: document.getElementById('modalNext'),
            statTotal: document.getElementById('statTotal'),
            statVisible: document.getElementById('statVisible'),
            statYears: document.getElementById('statYears')
        };

        this.init();
    }

    init() {
        this.sortData();
        this.setupFilters();
        this.setupSearch();
        this.setupModal();
        this.renderTimeline();
        this.updateStats();
        this.setupKeyboardNavigation();
    }

    sortData() {
        this.data.sort((a, b) => a.year - b.year);
    }

    setupFilters() {
        const types = [...new Set(this.data.map(event => event.type))];

        types.forEach(type => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.dataset.filter = type;
            btn.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            btn.setAttribute('aria-label', 'Filter by ' + type);

            btn.addEventListener('click', () => this.applyFilter(type));
            this.elements.filterControls.appendChild(btn);
        });

        const allBtn = this.elements.filterControls.querySelector('[data-filter="all"]');
        allBtn.addEventListener('click', () => this.applyFilter('all'));
    }

    applyFilter(filter) {
        this.currentFilter = filter;

        document.querySelectorAll('.filter-btn').forEach(btn => {
            const isActive = btn.dataset.filter === filter;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive);
        });

        if (filter === 'all') {
            this.filteredData = [...this.data];
        } else {
            this.filteredData = this.data.filter(event => event.type === filter);
        }

        this.renderTimeline();
        this.updateStats();
    }

    setupSearch() {
        let searchTimeout;

        this.elements.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });
    }

    performSearch(query) {
        if (!query.trim()) {
            this.applyFilter(this.currentFilter);
            return;
        }

        const searchTerm = query.toLowerCase();
        this.filteredData = this.data.filter(event => {
            return event.title.toLowerCase().includes(searchTerm) ||
                   event.type.toLowerCase().includes(searchTerm) ||
                   event.year.toString().includes(searchTerm) ||
                   (event.description && event.description.toLowerCase().includes(searchTerm));
        });

        if (this.currentFilter !== 'all') {
            this.filteredData = this.filteredData.filter(event => event.type === this.currentFilter);
        }

        this.renderTimeline();
        this.updateStats();
    }

    renderTimeline() {
        this.elements.timelineEvents.replaceChildren();

        if (this.filteredData.length === 0) {
            const empty = document.createElement('div');
            empty.style.cssText = 'color: var(--color-text-dim); padding: 40px 20px; text-align: center;';
            empty.textContent = 'No events found';
            this.elements.timelineEvents.appendChild(empty);
            return;
        }

        // Group events by year
        const eventsByYear = {};
        this.filteredData.forEach(event => {
            if (!eventsByYear[event.year]) {
                eventsByYear[event.year] = [];
            }
            eventsByYear[event.year].push(event);
        });

        const years = Object.keys(eventsByYear).sort((a, b) => a - b);
        const fragment = document.createDocumentFragment();

        years.forEach(year => {
            const events = eventsByYear[year];

            const section = document.createElement('div');
            section.className = 'year-section';

            // Year marker dot on rail
            const marker = document.createElement('div');
            marker.className = 'year-marker';
            section.appendChild(marker);

            // Year label
            const label = document.createElement('div');
            label.className = 'year-label';
            label.textContent = year;
            section.appendChild(label);

            // Card grid
            const grid = document.createElement('div');
            grid.className = 'year-cards';

            events.forEach(event => {
                grid.appendChild(this.createEventCard(event));
            });

            section.appendChild(grid);
            fragment.appendChild(section);
        });

        this.elements.timelineEvents.appendChild(fragment);
    }

    createEventCard(event) {
        const card = document.createElement('div');
        card.className = 'event-card type-' + event.type;
        card.dataset.eventId = event.id;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', event.title + ', ' + event.year + ', ' + event.type);

        const titleEl = document.createElement('div');
        titleEl.className = 'event-title';
        titleEl.textContent = event.title;

        const typeEl = document.createElement('div');
        typeEl.className = 'event-type type-' + event.type;
        typeEl.textContent = event.type;

        card.appendChild(titleEl);
        card.appendChild(typeEl);

        card.addEventListener('click', () => this.showEventDetails(event));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.showEventDetails(event);
            }
        });

        return card;
    }

    showEventDetails(event) {
        this.currentEventIndex = this.filteredData.findIndex(e => e.id === event.id);

        this.elements.modalTitle.textContent = event.title;
        this.elements.modalMeta.textContent = 'Year: ' + event.year + ' // Type: ' + event.type.toUpperCase();
        this.elements.modalDescription.textContent = event.description || 'No additional information available.';

        this.updateModalNavigation();
        this.elements.modal.classList.add('active');

        this._previousFocus = document.activeElement;
        this.elements.modalClose.focus();
    }

    closeModal() {
        this.elements.modal.classList.remove('active');
        if (this._previousFocus) {
            this._previousFocus.focus();
        }
    }

    updateModalNavigation() {
        this.elements.modalPrev.disabled = this.currentEventIndex === 0;
        this.elements.modalNext.disabled = this.currentEventIndex === this.filteredData.length - 1;
    }

    setupModal() {
        this.elements.modalClose.addEventListener('click', () => this.closeModal());
        this.elements.modalBackdrop.addEventListener('click', () => this.closeModal());

        this.elements.modalPrev.addEventListener('click', () => {
            if (this.currentEventIndex > 0) {
                this.currentEventIndex--;
                this.showEventDetails(this.filteredData[this.currentEventIndex]);
            }
        });

        this.elements.modalNext.addEventListener('click', () => {
            if (this.currentEventIndex < this.filteredData.length - 1) {
                this.currentEventIndex++;
                this.showEventDetails(this.filteredData[this.currentEventIndex]);
            }
        });

        // Focus trap inside modal
        this.elements.modal.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            const focusable = this.elements.modal.querySelectorAll(
                'button:not(:disabled), [tabindex]:not([tabindex="-1"])'
            );
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.elements.modal.classList.contains('active')) return;

            if (e.key === 'Escape') {
                this.closeModal();
            } else if (e.key === 'ArrowLeft' && !this.elements.modalPrev.disabled) {
                this.elements.modalPrev.click();
            } else if (e.key === 'ArrowRight' && !this.elements.modalNext.disabled) {
                this.elements.modalNext.click();
            }
        });
    }

    updateStats() {
        this.elements.statTotal.textContent = this.data.length;
        this.elements.statVisible.textContent = this.filteredData.length;

        if (this.filteredData.length > 0) {
            const years = [...new Set(this.filteredData.map(e => e.year))];
            const minYear = Math.min(...years);
            const maxYear = Math.max(...years);
            this.elements.statYears.textContent = minYear + '-' + maxYear;
        } else {
            this.elements.statYears.textContent = 'N/A';
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TimelineApp();
});
