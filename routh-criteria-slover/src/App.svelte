<script>
	import { routhCriteria } from "./lib/routh";
	import { Math } from "mathjax-svelte";
	import Plotly from "plotly.js-dist-min";
	import mathJs from "math.js";
	let accuracy = 10000;
	let input = "s^5+s^4+10s^3+72s^2+152s+240";
	let result = {};
	let degree = 0;
	function plotPoles() {
		let plotDiv = document.getElementById("plot");
		let x = [];
		let y = [];

		for (let i = 0; i < result.poles.length; i++) {
			x.push(result.poles[i][0]);
			y.push(result.poles[i][1]);
		}
		let data = [
			{
				x: x,
				y: y,
				mode: "markers",
				type: "scatter",
				marker: { size: 12 },
			},
		];

		Plotly.newPlot(plotDiv, data, {
			xaxis: {
				title: "Real Axis",
			},
			yaxis: {
				title: "Imaginary Axis",
			},
			margin: { t: 0 },
		});
		console.log(Plotly.BUILD);
	}
	function solve() {
		result = routhCriteria(input.toString());
		degree = result.map.size - 1;
		console.log(result);
		plotPoles();
	}
</script>

<main>
	<h1>Routh Criteria Solver</h1>
	<Math t={input} class="math" />
	<form on:submit|preventDefault={solve}>
		<input bind:value={input} />
		<input type="submit" value="Solve" />
	</form>
	{#if result.equation !== undefined}
		<h3>Solution</h3>
		<div class={"cases"}>
			{#if result.case1}
				<p>This equation requires a case 1 solution</p>
			{/if}
			{#if result.case2}
				<p>This equation requires a case 2 solution</p>
			{/if}
		</div>
		<div class="rows">
			{#each result.matrix as row, i}
				<div class="columns">
					<p class="first">{`s^${degree - i}`}</p>
					{#each row as col}
						<p>
							{mathJs.round(col * accuracy) / accuracy}
						</p>
					{/each}
				</div>
			{/each}
		</div>
		<div class="stability">
			{#if result.stable}
				<p class="stable">This system is stable</p>
			{:else}
				<p class="unstable">This system is unstable</p>
			{/if}
		</div>
	{/if}
	<div id="plot" />
</main>

<style>
</style>
