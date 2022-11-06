
const margin = { right: 10, left: 100, top: 10, bottom: 150 }

const width = 600 - (margin.left + margin.right)
const height = 400 - (margin.top + margin.bottom)

let flag = true
const transitionTimer = d3.transition().duration(750)

const svg = d3.select('#chart-area').append('svg')
    .attr('width', width + (margin.left + margin.right))
    .attr('height', height + (margin.top + margin.bottom))

const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

const yAxisGroup = g.append('g')
    .attr('class', 'y axis')

const xAxisGroup = g.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${height})`)

const xScale = d3.scaleBand()
    .range([0, width])
    .paddingInner(0.2)
    .paddingOuter(0.3)

const yScale = d3.scaleLinear()
    .range([height, 0])

const xLabel = g.append('text')
    .attr('class', 'x axis-label')
    .attr('x', width / 2)
    .attr('y', height + 70)
    .attr('font-size', '20px')
    .attr('text-anchor', "middle")
    .text("Month")

const yLabel = g.append('text')
    .attr('class', 'y axis-label')
    .attr('x', - height / 2)
    .attr('y', -60)
    .attr('font-size', '20px')
    .attr('text-anchor', "middle")
    .attr('transform', "rotate(-90)")
    .text("Revenue")

d3.json('./data/revenues.json')
    .then(data => {
        d3.interval(() => {
            const newData = flag ? data : data.slice(1)
            update(newData)
            flag = !flag
        }, 2000)

        //first render
        update(data)
    })

function update(data) {
    let value = flag ? 'revenue' : 'profit'

    xScale.domain(data.map(el => el.month))
    yScale.domain([0, d3.max(data, d => +d[value])])

    // bind circles to data
    const circles = g.selectAll('circle')
        .data(data, (d) => {
            return d.month
        })

    // delete old elements
    circles
        .exit()
        .attr('fill', 'red')
        .transition()
        .attr('cy', yScale(0))
        .remove()

    //enter new circles
    circles.enter()
        .append('circle')
        .attr('stroke', 'black')
        .attr('fill', 'grey')
        .attr('cy', yScale(0))
        .attr('cx', (d) => xScale(d.month) + xScale.bandwidth() / 2)
        .attr('r', 5)
        // update circles
        .merge(circles)
        .transition(transitionTimer)
        .attr('cy', (d) => yScale(+d[value]))
        .attr('cx', (d) => xScale(d.month) + xScale.bandwidth() / 2)

    const xAxisCall = d3.axisBottom(xScale)
    xAxisGroup.call(xAxisCall)
        .selectAll('text')
        .attr('cy', '10')
        .attr('cx', '0')
        .attr('text-anchor', 'middle')

    const yAxisCall = d3.axisLeft(yScale)
    yAxisGroup.call(yAxisCall)

    let label = flag ? 'Revenue' : 'Profit'
    yLabel.text(label)
}
