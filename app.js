// ABOUTME: Main application logic for Alien Canon Timeline SPA
// ABOUTME: Handles vertical timeline rendering, filtering, search, and hover-to-expand cards

class TimelineApp {
    constructor() {
        this.data = timelineData;
        this.filteredData = [...this.data];
        this.currentFilter = 'all';

        this.elements = {
            filterControls: document.getElementById('filterControls'),
            searchInput: document.getElementById('searchInput'),
            timelineViewport: document.getElementById('timelineViewport'),
            timelineEvents: document.getElementById('timelineEvents'),
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
        this.renderTimeline();
        this.updateStats();
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

            const marker = document.createElement('div');
            marker.className = 'year-marker';
            section.appendChild(marker);

            const label = document.createElement('div');
            label.className = 'year-label';
            label.textContent = year;
            section.appendChild(label);

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

        // Description revealed on hover / focus
        if (event.description) {
            const descEl = document.createElement('div');
            descEl.className = 'event-description';
            descEl.textContent = event.description;
            card.appendChild(descEl);
        }

        return card;
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
