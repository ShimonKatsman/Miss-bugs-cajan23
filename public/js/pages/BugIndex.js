// בס"ד

'use strict'

import { bugService } from '../services/bug.service.js'
import bugList from '../cmps/BugList.js'
import bugFilter from '../cmps/BugFilter.js'

export default {
	template: `
    <section class="bug-app">
        <div class="subheader">
          <bug-filter @setFilterBy="setFilterBy"></bug-filter> ||
          <router-link to="/bug/edit">Add New Bug</router-link> 
        </div>
        <bug-list v-if="bugs" :bugs="bugsToDisplay" @removeBug="removeBug"></bug-list>
    </section>
    `,
	data() {
		return {
			bugs: null,
			filterBy: null,
		}
	},
	created() {
		this.loadBugs()
	},
	methods: {
		loadBugs() {
			bugService.query(this.filterBy).then((bugs) => {
				this.bugs = bugs
			})
		},
		setFilterBy(filterBy) {
			this.filterBy = filterBy
			this.loadBugs()
		},
		removeBug(bugId) {
			bugService.remove(bugId).then(() => this.loadBugs())
		},
	},
	computed: {
		bugsToDisplay() {
			if (!this.filterBy?.title) return this.bugs
			return this.bugs.filter((bug) => bug.title.includes(this.filterBy.title))
		},
	},
	components: {
		bugList,
		bugFilter,
	},
}
