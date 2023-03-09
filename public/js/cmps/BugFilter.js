// בס"ד

'use strict'

export default {
  template: `
        <section class="bug-filter">
            <span>Filter by text: </span>
            <input @input="setFilterBy" type="text" v-model="filterBy.txt">
            <span>Filter by severity: </span>
            <input @input="setFilterBy" type="number" v-model="filterBy.severity">
            <span>Filter by label: </span>
            <section >
              <input @input="setLabels('critical')" type="checkbox" ><label>critical</label>
              <input @input="setLabels('need-CR')" type="checkbox" ><label>need-CR</label>
              <input @input="setLabels('dev-branch')" type="checkbox" ><label>dev-branch</label>
            </section>
            <section>
              <button @click="pageFlip(1)">Next page</button> |
              <button @click="pageFlip(-1)">Prev page</button>
            </section>
        </section>
    `,
  data() {
    return {
      filterBy: {
        txt: '',
        severity: 0,
        labels: [],
        page: 0
      },
    }
  },
  methods: {
    setFilterBy() {
      this.$emit('setFilterBy', this.filterBy)
    },
    pageFlip(num) {
      this.filterBy.page += num
      console.log('this.filterBy.page', this.filterBy.page)
      this.setFilterBy()
      if (this.filterBy.page < 0) this.filterBy.page = 0
    },
    setLabels(val) {
      if (this.filterBy.labels.includes(val)) {
        this.filterBy.labels.splice(this.filterBy.labels.findIndex(item => item === val), 1)

        this.setFilterBy()
        return
      }

      this.filterBy.labels.push(val)
      this.setFilterBy()
    },
  },
}
