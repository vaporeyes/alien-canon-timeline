// ABOUTME: Main application logic for Alien Canon Timeline SPA
// ABOUTME: Handles timeline rendering, SVG connections, filtering, and user interactions

class TimelineApp {
    constructor() {
        this.data = timelineData;
        this.filteredData = [...this.data];
        this.currentFilter = 'all';
        this.currentEventIndex = 0;
        this.timelinePosition = 0;

        this.elements = {
            filterControls: document.getElementById('filterControls'),
            searchInput: document.getElementById('searchInput'),
            timelineViewport: document.getElementById('timelineViewport'),
            timelineContainer: document.getElementById('timelineContainer'),
            timelineSvg: document.getElementById('timelineSvg'),
            timelineEvents: document.getElementById('timelineEvents'),
            modal: document.getElementById('modal'),
            modalBackdrop: document.getElementById('modalBackdrop'),
            modalClose: document.getElementById('modalClose'),
            modalTitle: document.getElementById('modalTitle'),
            modalMeta: document.getElementById('modalMeta'),
            modalDescription: document.getElementById('modalDescription'),
            modalPrev: document.getElementById('modalPrev'),
            modalNext: document.getElementById('modalNext'),
            navPrev: document.getElementById('navPrev'),
            navNext: document.getElementById('navNext'),
            navReset: document.getElementById('navReset'),
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
        this.setupNavigation();
        this.setupModal();
        this.renderTimeline();
        this.updateStats();
        this.setupKeyboardNavigation();
        this.setupMouseWheel();
        this.setupResize();
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
        this.elements.timelineSvg.replaceChildren();

        if (this.filteredData.length === 0) {
            const empty = document.createElement('div');
            empty.style.cssText = 'color: var(--color-text-dim); padding: 20px;';
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

        // Each event gets its own horizontal slot. The card width plus
        // a gap determines the column spacing. Year groups expand to
        // fit all their events side by side.
        const cardSlotWidth = 310;
        const aboveOffset = 35;
        const belowOffset = 60;

        const fragment = document.createDocumentFragment();
        let xPosition = 100;

        years.forEach((year) => {
            const events = eventsByYear[year];
            const yearGroup = document.createElement('div');
            yearGroup.className = 'year-group';
            yearGroup.style.left = xPosition + 'px';

            const yearMarker = document.createElement('div');
            yearMarker.className = 'year-marker';

            const yearLabel = document.createElement('div');
            yearLabel.className = 'year-label';
            yearLabel.textContent = year;

            events.forEach((event, eventIndex) => {
                const eventCard = this.createEventCard(event);
                const isAbove = eventIndex % 2 === 0;

                // Spread cards horizontally within the year group.
                // Pairs share a column: index 0,1 in col 0; 2,3 in col 1; etc.
                const column = Math.floor(eventIndex / 2);
                const cardLeft = column * cardSlotWidth;
                eventCard.style.left = cardLeft + 'px';

                if (isAbove) {
                    eventCard.classList.add('position-above');
                    eventCard.style.bottom = aboveOffset + 'px';
                } else {
                    eventCard.classList.add('position-below');
                    eventCard.style.top = belowOffset + 'px';
                }

                yearGroup.appendChild(eventCard);
            });

            // Center the year marker and label across the full group width
            const columns = Math.ceil(events.length / 2);
            const groupWidth = Math.max(1, columns) * cardSlotWidth;
            const centerX = (groupWidth - cardSlotWidth) / 2 + cardSlotWidth / 2;
            yearMarker.style.left = centerX + 'px';
            yearLabel.style.left = centerX + 'px';

            yearGroup.appendChild(yearMarker);
            yearGroup.appendChild(yearLabel);
            xPosition += Math.max(1, columns) * cardSlotWidth + 80;

            fragment.appendChild(yearGroup);
        });

        const totalWidth = xPosition + 100;
        this.elements.timelineContainer.style.width = totalWidth + 'px';
        this.elements.timelineSvg.setAttribute('width', totalWidth);
        this.elements.timelineSvg.setAttribute('height', '100%');

        this.elements.timelineEvents.appendChild(fragment);

        // Draw SVG connections after layout is computed
        requestAnimationFrame(() => {
            this.drawConnections();
        });
    }

    createEventCard(event) {
        const card = document.createElement('div');
        card.className = 'event-card type-' + event.type;
        card.dataset.eventId = event.id;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', event.title + ', ' + event.year + ', ' + event.type);

        const yearEl = document.createElement('div');
        yearEl.className = 'event-year';
        yearEl.textContent = event.year;

        const titleEl = document.createElement('div');
        titleEl.className = 'event-title';
        titleEl.textContent = event.title;

        const typeEl = document.createElement('div');
        typeEl.className = 'event-type type-' + event.type;
        typeEl.textContent = event.type;

        card.appendChild(yearEl);
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

    drawConnections() {
        this.elements.timelineSvg.replaceChildren();

        const svgRect = this.elements.timelineSvg.getBoundingClientRect();
        const viewportHeight = this.elements.timelineViewport.offsetHeight;
        const timelineY = viewportHeight / 2;
        const cards = this.elements.timelineEvents.querySelectorAll('.event-card');

        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const isAbove = card.classList.contains('position-above');
            const type = card.className.match(/type-(\w+)/);
            const typeName = type ? type[1] : '';

            // Card center X relative to SVG coordinate space
            const cardCenterX = cardRect.left + cardRect.width / 2 - svgRect.left;

            // Near edge of card (bottom for above cards, top for below)
            const cardEdgeY = isAbove
                ? cardRect.bottom - svgRect.top
                : cardRect.top - svgRect.top;

            // Curved path from card edge to timeline center
            const dist = Math.abs(cardEdgeY - timelineY);
            const controlOffset = dist * 0.4;

            let pathData;
            if (isAbove) {
                pathData = 'M ' + cardCenterX + ' ' + cardEdgeY +
                    ' C ' + cardCenterX + ' ' + (cardEdgeY + controlOffset) +
                    ', ' + cardCenterX + ' ' + (timelineY - controlOffset) +
                    ', ' + cardCenterX + ' ' + timelineY;
            } else {
                pathData = 'M ' + cardCenterX + ' ' + cardEdgeY +
                    ' C ' + cardCenterX + ' ' + (cardEdgeY - controlOffset) +
                    ', ' + cardCenterX + ' ' + (timelineY + controlOffset) +
                    ', ' + cardCenterX + ' ' + timelineY;
            }

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.classList.add('timeline-connector', 'type-' + typeName);
            path.setAttribute('d', pathData);
            this.elements.timelineSvg.appendChild(path);
        });
    }

    showEventDetails(event) {
        this.currentEventIndex = this.filteredData.findIndex(e => e.id === event.id);

        this.elements.modalTitle.textContent = event.title;
        this.elements.modalMeta.textContent = 'Year: ' + event.year + ' // Type: ' + event.type.toUpperCase();
        this.elements.modalDescription.textContent = event.description || 'No additional information available.';

        this.updateModalNavigation();
        this.elements.modal.classList.add('active');

        // Store previously focused element and move focus into modal
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

    setupNavigation() {
        const scrollAmount = 400;

        this.elements.navPrev.addEventListener('click', () => {
            this.timelinePosition = Math.min(0, this.timelinePosition + scrollAmount);
            this.updateTimelinePosition();
        });

        this.elements.navNext.addEventListener('click', () => {
            const maxScroll = -(this.elements.timelineContainer.offsetWidth - this.elements.timelineViewport.offsetWidth);
            this.timelinePosition = Math.max(maxScroll, this.timelinePosition - scrollAmount);
            this.updateTimelinePosition();
        });

        this.elements.navReset.addEventListener('click', () => {
            this.timelinePosition = 0;
            this.updateTimelinePosition();
        });
    }

    updateTimelinePosition() {
        this.elements.timelineContainer.style.transform = 'translateX(' + this.timelinePosition + 'px)';
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (this.elements.modal.classList.contains('active')) {
                if (e.key === 'Escape') {
                    this.closeModal();
                } else if (e.key === 'ArrowLeft' && !this.elements.modalPrev.disabled) {
                    this.elements.modalPrev.click();
                } else if (e.key === 'ArrowRight' && !this.elements.modalNext.disabled) {
                    this.elements.modalNext.click();
                }
            } else {
                if (e.key === 'ArrowLeft') {
                    this.elements.navPrev.click();
                } else if (e.key === 'ArrowRight') {
                    this.elements.navNext.click();
                }
            }
        });
    }

    setupMouseWheel() {
        this.elements.timelineViewport.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

            e.preventDefault();
            const scrollAmount = e.deltaY * 2;
            const maxScroll = -(this.elements.timelineContainer.offsetWidth - this.elements.timelineViewport.offsetWidth);

            this.timelinePosition = Math.max(maxScroll, Math.min(0, this.timelinePosition - scrollAmount));
            this.updateTimelinePosition();
        }, { passive: false });
    }

    setupResize() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.renderTimeline();
            }, 200);
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
