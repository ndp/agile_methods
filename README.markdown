I created a quick visualization about agile methodologies:

<a href="http://ndpsoftware.com/agile_methods/agile_methods.html">http://ndpsoftware.com/agile_methods/agile_methods.html</a> (If it seems to draw garbage all over the screen, refresh the page. More on that later.)

What it shows is the main concepts of 5 different agile viewpoints: XP, Scrum, the Agile Manifesto, Lean and Getting Real. Sure

h3. Motivation

There are different flavors of agile. I think I can discuss the differences coherently, but I wondered if there were some way to distill the differences down to something that could be represented in one page. All these practices share some history and concepts, but can be they  be presented and compared in a fairly simplistic way?


h3. Building the Visualization

The first challenge was to revisit each methodology and identify the top few values and concepts that define it. My idea to summarize each practice was to just find the canonical description of each methodology and capture the top concepts as succinctly as possible. 

So I identified a primary source for each methodology. This is arbitrary but not capricious. I believe I was picking reasonable documents.

<ol>
<li>XP: <a href="http://www.extremeprogramming.org/">http://www.extremeprogramming.org/</a>
<li>Agile Manifesto: <a href="http://agilemanifesto.org/">http://agilemanifesto.org/</a>, <a href="http://agilemanifesto.org/principles.html">http://agilemanifesto.org/principles.html</a>
<li>Scrum: Agile Software Development with Scrum, Chapter 9; and <a href="http://en.wikipedia.org/wiki/Scrum_(development)">http://en.wikipedia.org/wiki/Scrum_(development)</a>
<li>Lean Software: <a href="http://en.wikipedia.org/wiki/Lean_software_development">http://en.wikipedia.org/wiki/Lean_software_development</a>
<li>Getting Real: from page 2 of the book
</ol>


Next, I needed to extract the concepts. I created a spreadsheet and listed concepts down the left side, and methodologies across the top. I put a number in any box where the methodology mentioned the concept as one of its first 10 points. The first concept mentioned on the page got a "1", and the 10th one got a "10". I didn't collect concepts much beyond that. I ended up with a big grid like this:


<table>
	<tr>
		<th></th>
		<th>http://www.extremeprogramming.org/</th>
		<th>http://agilemanifesto.org/</th>
	</tr>
	<tr>
		<th>Face-to-face communication</th>
		<th></th>
		<th>1</th>
	</tr>
	<tr>
		<th>Individuals</th>
		<th></th>
		<th>1</th>
	</tr>
	<tr>
		<th>Working Software</th>
		<th></th>
		<th>2</th>
	</tr>
	<tr>
		<th>Collaborate with Customers </th>
		<th></th>
		<th>3</th>
	</tr>
	<tr>
		<th>Respond to Change</th>
		<th></th>
		<th>4</th>
	</tr>
	<tr>
		<th>Customer Satisfaction</th>
		<th>1</th>
		<th></th>
	</tr>
	<tr>
		<th>Working Software</th>
		<th>2</th>
	</tr>
</table>


As the terminologies of each practice differ, I had a sparse spreadsheet with only a few data points. It wasn't helpful in comaring the practices.

So went through a normalization process. Is a "sprint" the same thing as an "iteration"? Well yes, and no. What's a "project heartbeat?" and is it the same thing? I combined rather aggressively the first time, but then repeated with a more conservative approach. It's at a pretty good state, but there are still problems: all practices value direct communication over isolated writing, but they all express it and emphasize it in subtly different ways. I took a pretty good shot, though.

Even with the "normalized spreadsheet", it wasn't that easy to compare the practices. I tried different sorting and coloring to no avail. I then tried different graphing options, starting first with "mind maps". I tried 3d bar charts, but they were little help. And plotting the words in grids, but couldn't make it work.

I finally stumbled upon the visual theseaurus metaphor. As a thesaurus, I always thought this display a bit gratuitous: a word in the center with its synonyms "floating around", connected by some gravity. The more I thought about it, the better fit it seemed.
       
Next I needed a tool to implement my visualization in. You can license the technology, but I had a $0 budget and just a few hours to devote to it. I looked at using Processing (a Java variant that lots of people are using to build visualizations); there were some implementations here, but I wanted something even lighter weight if possible. After another Google or two, and I found someone who had experimented with "force directed graphs" in Javascript. That's another name for the same thing. I grabbed the code, and threw my data in it.

Actually, there was a little engineering involved. I knew I would update the spreadsheet (and I wanted to add methodologies potentially), so instead of converting the spreadsheet directly to the Javascript, I wrote a Ruby script that takes the spreadsheet and generates JSON data structures. The structures are then fed into a small engine I wrote, and the graphic is created.



