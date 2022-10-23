/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.5 - Activity: Adding SVGs to the screen
*/

// add circles simple ex (1)
// const data = [15, 25, 30, 35, 50, 55, 45]

// const data = d3.json('/data/buildings.json').then((data) => {
//     const svg = d3.select("#chart-area").append("svg")
//         .attr("width", 400)
//         .attr("height", 400)

//     const circles = svg.selectAll("circle").data(data)

//     circles.enter()
//         .append("circle")
//         .attr("cx", (_, i) => 50 * i + 35)
//         .attr("cy", () => 100)
//         .attr("r", d => d.height / 10)
//         .attr("fill", "blue")
//         .attr("stroke", "black")

// })

// Bars with scale ex (2)

const data = d3.json('/data/buildings.json').then((data) => {
    const margin = { right: 10, left: 100, top: 10, bottom: 150 }

    const width = 600 - (margin.left + margin.right)
    const height = 400 - (margin.top + margin.bottom)

    const svg = d3.select("#chart-area").append("svg")
        .attr("width", width + (margin.left + margin.right))
        .attr("height", height + (margin.top + margin.bottom))

    const group = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const maxHeight = d3.max(data, (d) => +d.height)

    const allNames = data.map(el => el.name)

    const scaleY = d3.scaleLinear()
        .domain([0, maxHeight])
        .range([height, 0])

    const scaleX = d3.scaleBand()
        .domain(allNames)
        .range([0, width])
        .paddingInner(0.2)
        .paddingOuter(0.3)

    const xAxisCall = d3.axisBottom(scaleX)
    group.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxisCall)
        .selectAll('text')
        .attr('y', '10')
        .attr('x', '-5')
        .attr('text-anchor', 'end')
        .attr('transform', 'rotate(-40)')

    const yAxisCall = d3.axisLeft(scaleY)
        .ticks(4)
        .tickFormat(d => `${d}m`)
    group.append('g')
        .attr('class', 'y axis')
        .call(yAxisCall)

    group.append('text')
        .attr('class', 'x axis-label')
        .attr('x', width / 2)
        .attr('y', height + 140)
        .attr('font-size', '20px')
        .attr('text-anchor', "middle")
        .text("The world's tallest building")

    group.append('text')
        .attr('class', 'y axis-label')
        .attr('x', - height / 2)
        .attr('y', -60)
        .attr('font-size', '20px')
        .attr('text-anchor', "middle")
        .attr('transform', "rotate(-90)")
        .text("Height (m)")


    const rects = group.selectAll("rect").data(data)
    rects.enter()
        .data(data)
        .append("rect")
        .attr("x", (d) => scaleX(d.name))
        .attr("y", d => scaleY(+d.height))
        .attr("width", scaleX.bandwidth)
        .attr("height", (d) => height - scaleY(+d.height))
        .attr("fill", "gray")
        .attr("stroke", "black")

})
