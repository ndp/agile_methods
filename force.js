//JavaScript - http://www.kylescholz.com/projects/force/example01.html


//http://www.kylescholz.com/projects/force/example01.html
//http://www.kylescholz.com/projects/force/event.js

//
// This work is licensed under the Creative Commons Attribution 2.5 License. To 
// view a copy of this license, visit
// http://creativecommons.org/licenses/by/2.5/
// or send a letter to Creative Commons, 543 Howard Street, 5th Floor, San
// Francisco, California, 94105, USA.
//
// All copies and derivatives of this source must contain the license statement 
// above and the following attribution:
//
// Author: Kyle Scholz      http://kylescholz.com/
// Copyright: 2006
//

    // EventHandler: a factory for producing event handlers w/ contextual scope
    // - context: an object with scope needed by handler
    // - handler: an event handler function
    var EventHandler = function( context, handler, e ){
      return(
        function( e ) {
          handler( context, e );
        }
      );
    };


//http://www.kylescholz.com/projects/force/timer.js

//
// This work is licensed under the Creative Commons Attribution 2.5 License. To 
// view a copy of this license, visit
// http://creativecommons.org/licenses/by/2.5/
// or send a letter to Creative Commons, 543 Howard Street, 5th Floor, San
// Francisco, California, 94105, USA.
//
// All copies and derivatives of this source must contain the license statement 
// above and the following attribution:
//
// Author: Kyle Scholz      http://kylescholz.com/
// Copyright: 2006
//

    // TimerControl: 
    var TimerControl = function(){};
    TimerControl.prototype = {
      initialize: function( timeout ) {
        this['timer'];
        this['TIMEOUT'] = timeout;
        this['interupt'] = true;
        this['subscribers'] = new Array();
        this['ontimeout'] = new EventHandler( this,
          // notify subscribers and restart timer
          function( context ) {
            context.notify();
            if ( !context.interupt ) { context.start(); }
          }
        );
      },

      start: function() {
        this['interupt']=false;
        this['timer'] = setTimeout(this.ontimeout,this['TIMEOUT']);
      },

      stop: function() {
        this['interupt']=true;
      },

      // add observers to subscribers queue
      subscribe: function( observer ) {
        this.subscribers.push( observer );
      },

      // notify observers wen an event has occured
      notify: function( key, value ) {
        for( var i=0; i<this.subscribers.length; i++ ) {
          this.subscribers[i].update();
        }
      }
    }


//http://www.kylescholz.com/projects/force/graph.js

//
// This work is licensed under the Creative Commons Attribution 2.5 License. To 
// view a copy of this license, visit
// http://creativecommons.org/licenses/by/2.5/
// or send a letter to Creative Commons, 543 Howard Street, 5th Floor, San
// Francisco, California, 94105, USA.
//
// All copies and derivatives of this source must contain the license statement 
// above and the following attribution:
//
// Author: Kyle Scholz      http://kylescholz.com/
// Copyright: 2006
//

// Node:
var Node = function( id, mass, x, y ) {
  this['id'] = id;
  this['mass'] = mass;

  this['neighbors']=0;

  this['position']=new Object();
  this['position']['x']=x;
  this['position']['y']=y;

  this['force']=new Object();
  this['force']['x']=0;
  this['force']['y']=0;
};

// Distance:
var Distance = function(){};
Distance.prototype = {
  calculate: function( pointA, pointB ) {
    // X Distance
    this['dx'] = pointA['x'] - pointB['x'];
    // Y Distance
    this['dy'] = pointA['y'] - pointB['y'];
    this['d2'] = (this['dx']*this['dx']+this['dy']*this['dy']);
    // Distance
    this['d'] = Math.sqrt(this['d2']);
  }
};

// Graph:
var Graph = function(){};
Graph.prototype = {
  initialize: function( frame_width, frame_height ) {
    this.frame_width=frame_width;
    this.frame_height=frame_height;

    // an attractive force is applied between each node and the origin
    this.origin = new Node( 'origin', 1, parseInt(this.frame_width/2), parseInt(this.frame_height/2));
    this.originWeight=48;

    // a "speed" multiple applied to all of the forces in each iteration
    // (a higher number makes the graph move faster but also makes it more volatile)
    this.speed = 12;

    // actually an _inverse_ gravity constant, used in calculating repulsive force
    this['gravity']=96;

    // the maximum repulsive force that can be applied in an iteration
    this['max_repulsive_force_distance']=512;

    // the UI that will listen to this graph
    this['ui'];

    // the current selected node (when a node is selected, no forces may be applied to it
    this['selectedNode']=-1;

    // parallel arrays
    this.nodes = new Array();
    this.edges = new Array();
    this.originEdges = new Array();

    this['nodesText'] = new Object();
  },

  // add observers to subscribers queue
  setUI: function( ui ) {
    this['ui']=ui;
    ui.drawFrame( this.frame_width, this.frame_height );
    ui.drawOrigin( this.origin );
  },

  // Graph is a TimerControl Listener. This is the function the TimerControl event handler calls
  update: function() {
    this.applyForce();
  },

  //
  getOrigin: function() {
    return this.origin;
  },

  // apply an attractive force between a node and the origin
  // F = (currentLength - desiredLength)
  originForce: function( nodeI, distance ) {

    if ( this.originEdges[nodeI.id] ) {
      if ( nodeI.id != this['selectedNode'] ) {
        var weight = this.originEdges[nodeI.id];
        var attractive_force = (distance['d'] - weight)/weight;
        nodeI['force']['x'] += attractive_force * (distance['dx'] / distance['d']);
        nodeI['force']['y'] += attractive_force * (distance['dy'] / distance['d']);
      }

    } else if ( nodeI.id != this['selectedNode'] ) {

      var repulsive_force=this['gravity']*nodeI['mass']*this.origin['mass']/distance['d2'];
      var df = this['max_repulsive_force_distance']-distance['d'];
      if ( df > 0 ) {
        repulsive_force *= (Math.log(df));
      }

      if ( repulsive_force < 1024 ) {
        nodeI['force']['x'] -= repulsive_force * distance['dx'] / distance['d'];
        nodeI['force']['y'] -= repulsive_force * distance['dy'] / distance['d'];
      }

    }
  },

  // apply an attractive force between two nodes
  attractiveForce: function( nodeI, nodeJ, distance ) {
    //   F = (currentLength - desiredLength)
    var weight = this.edges[nodeI.id][nodeJ.id];
    weight += (3 * (nodeI.neighbors+nodeJ.neighbors));

    if ( weight ) {
      var attractive_force = (distance['d'] - weight)/weight;

      if ( nodeI.id != this['selectedNode'] ) {
        nodeI['force']['x'] -= attractive_force * distance['dx'] / distance['d'];
        nodeI['force']['y'] -= attractive_force * distance['dy'] / distance['d'];
      }

      // since edges are one way in our data structure, we need to explicitly add
      // an equal attractive force to our neighbor
      if ( nodeJ.id != this['selectedNode'] ) {
        nodeJ['force']['x'] += attractive_force * distance['dx'] / distance['d'];
        nodeJ['force']['y'] += attractive_force * distance['dy'] / distance['d'];
      }

    }
  },

  // apply a repulsive force between two nodes
  repulsiveForce: function( nodeI, nodeJ, distance ) {
    //   force = gravity*(mass1*mass2)/distance^2.
    var repulsive_force=this['gravity']*nodeI['mass']*nodeJ['mass']/distance['d2'];
    var df = this['max_repulsive_force_distance']-distance['d'];
    if ( df > 0 ) {
      repulsive_force *= (Math.log(df));
    }

    if ( repulsive_force < 1024 ) {
      nodeI['force']['x'] += repulsive_force * distance['dx'] / distance['d'];
      nodeI['force']['y'] += repulsive_force * distance['dy'] / distance['d'];
    }
  },

  // iterate through all of the nodes, calculating applicable forces, then apply to the node's position
  applyForce: function() {

	// draw nodes
    try {
      this.ui.drawNodes();
    } catch( e ) {
      alert( "Error Drawing Nodes: " + e );
    }

	// draw edges
    try {
      this.ui.drawEdges();
    } catch( e ) {
      alert( "Error Drawing Edges: " + e );
    }

	// reposition nodes
    for( var i=0; i<this.nodes.length; i++ ) {
      var nodeI = this.nodes[i];

      for( var j=0; j<this.nodes.length; j++ ) {
        if ( i != j ) {

          var nodeJ = this.nodes[j];

          // get the distance between nodes
          var distance = new Distance();
          distance.calculate( nodeI.position, nodeJ.position );

          // attractive force applied across an edge
          if ( this.edges[nodeI.id] && this.edges[nodeI.id][nodeJ.id] ) {
            this.attractiveForce(nodeI, nodeJ, distance);
          }
          // repulsive force between any two nodes
          if ( i != this['selectedNode'] ) {
            this.repulsiveForce(nodeI, nodeJ, distance);
          }
        }
      }

      // attractive force to the origin
      // get the distance between node and origin
      var distance = new Distance();
      distance.calculate( this.origin.position, nodeI.position );
      this.originForce(nodeI, distance);

      // speed multiple
      nodeI['force']['x']*=this.speed;
      nodeI['force']['y']*=this.speed;

      // add forces to node position
      nodeI['position']['x'] += nodeI['force']['x'];
      nodeI['position']['y'] += nodeI['force']['y'];

      // wipe forces for iteration
      nodeI['force']['x']=0;
      nodeI['force']['y']=0;

      // keep the node in our frame
      this.bounds(nodeI);

    } // for
  },

  // force a node to stay in bounds {
  bounds: function( node ) {
    var d = (this.ui.nodeRadius( node )*2) + 4;

    var cxl = node['position']['x'];
    var cxm = node['position']['x'] + d;
    var cyl = node['position']['y'];
    var cym = node['position']['y'] + d;

    if ( cxl < 0 ) { node['position']['x']  = 0; }
    if ( cyl < 0 ) { node['position']['y']  = 0; }

    if ( cxm > this.frame_width ) { node['position']['x']  = this.frame_width - d; }
    if ( cym > this.frame_height ) { node['position']['y']  = this.frame_height - d; }
  },

  // add an edge to the graph
  addEdge: function( node1, node2, weight ) {

    if ( !this.edges[node1.id] ) {
      this.edges[node1.id]=new Object();
    }
    this.edges[node1.id][node2.id]=weight;
    try {
      this.ui.addEdge( node1, node2, weight );
      node1['neighbors']++;
      node2['neighbors']++;
    } catch( e ) {
      //TODO: handle
      alert( "Error Adding Edge: " + e );
    }
  },

  // remove an edge from the graph
  removeEdge: function( node1, node2 ) {
    try {
      delete this.edges[node1.id];
      this.ui.removeEdge( node1, node2 );
      node1['neighbors']--;
      node2['neighbors']--;
    } catch( e ) {
      //TODO: handle
      alert( "Error Removing Edge: " + e );
    }
  },

  // add an edge to the graph
  addOriginEdge: function( node, weight ) {
    try {
      this.originEdges[node.id]=weight;
    } catch( e ) {
      //TODO: handle
      alert( "Error Adding Origin Edge: " + e );
    }
  },

  removeOriginEdge: function( node ) {
      this.ui.removeEdge( node, graph.getOrigin());
      delete this.originEdges[node.id];
  },

  // add a node to the graph
  addNode: function( mass, text ) {
    // initialize the new node at a random offset from the origin
    var offsetx = (Math.random()*100)-50;
    var offsety = (Math.random()*100)-50;

    // store floats that represent the 'real' position of a node
    var x =this.frame_width/2 - offsetx;
    var y =this.frame_height/2 - offsety;

    // create the Node and add it to the collection
    var i = this.nodes.length;
    var node = new Node( i, mass, x, y );
    this.nodes.push(node);

    this['nodesText'][text] = node;

    try {
      this.ui.addNode(node,text);
    } catch( e ) {
      alert( "Error Adding Node: " + e );
      //todo: handle
    }
    return node;
  },

  // support access to nodes by their text value
  getNodeByText: function( text ) {
    if (this['nodesText'][text]) {
      return this['nodesText'][text];
    } else {
      return null;
    }
  },

  // set the selected node (by id)
  setSelected: function( nodeId ) {
    this['selectedNode'] = nodeId;
  },

  // get the selected node (returns id)
  getSelected: function() {
    return this['selectedNode'];
  },

  // clear the selected node
  clearSelected: function() {
    this['selectedNode'] = -1;
  },

  // indicate wif we have a selected node
  hasSelected: function() {
    return (this['selectedNode'] != -1 );
  },

  // get a node by id
  getNode: function( nodeId ) {
    return this.nodes[nodeId];
  }
}


//http://www.kylescholz.com/projects/force/domui.js

//
// This work is licensed under the Creative Commons Attribution 2.5 License. To 
// view a copy of this license, visit
// http://creativecommons.org/licenses/by/2.5/
// or send a letter to Creative Commons, 543 Howard Street, 5th Floor, San
// Francisco, California, 94105, USA.
//
// All copies and derivatives of this source must contain the license statement 
// above and the following attribution:
//
// Author: Kyle Scholz      http://kylescholz.com/
// Copyright: 2006
//

NODE_RADIUS=6;

// GraphUI:
var GraphUI = function(){};
GraphUI.prototype = {

  initialize: function( frame, origin, displayOriginEdges, displayEdges ) {
    this['frame']=frame;    // frame dom object
    this.origin=origin;  // origin dom object

    this.frame_width=parseInt(frame.style.width);
    this.frame_height=parseInt(frame.style.height);
    this.frame_top=parseInt(frame.style.top);
    this.frame_left=parseInt(frame.style.left);

    // switch for displaying origin edges
    this.displayOriginEdges = true;
    if ( displayOriginEdges != null ) {
      this.displayOriginEdges = displayOriginEdges;
    }

    // switch for displaying non-origin edges
      this.displayEdges = true;
    if ( displayEdges != null ) {
      this.displayEdges = displayEdges;
    }

  },

  // draw all nodes
  drawNodes: function() {
    for( var i=0; i<graph['nodes'].length; i++ ) {
      this.drawNode( graph.nodes[i] );
    }
  },

  // draw all edges
  drawEdges: function() {
    for( var i=0; i<graph.nodes.length; i++ ) {
      if ( this.displayOriginEdges ) {
        if ( graph.originEdges[i] ) {
          nodeI = graph.getNode(i);
          nodeJ = graph.origin;
          var distance = new Distance();
          distance.calculate( nodeI.position, nodeJ.position );
          this.drawEdge( nodeI, nodeJ, distance );
        }
      }
      
      if ( this.displayEdges ) {
        for( var j=0; j<graph.nodes.length; j++ ) {
          if ( graph.edges[i] && graph.edges[i][j] ) {
            nodeI = graph.getNode(i);
            nodeJ = graph.getNode(j);
            var distance = new Distance();
            distance.calculate( nodeI.position, nodeJ.position );
            this.drawEdge( nodeI, nodeJ, distance );
          }
        }
      }
    }
  },

  //
  setOriginText: function( text ) {
    this.origin.innerHTML=text;
  },

  nodeRadius: function( node ) {
//    return( NODE_RADIUS );
    return( node.mass*4 );
  },

  // draw the node at it's current position
  drawNode: function( node ) {
    try {
      this.getNode(node.id).style.left = (this.frame_left + node['position']['x']);
      this.getNode(node.id).style.top = (this.frame_top + node['position']['y']);
    } catch( e ) {
    }
  },

  // draw the frame
  drawFrame: function( frame_width, frame_height ) {
    this.frame_width=frame_width;
    this.frame_height=frame_height;
    this.frame.style.width=frame_width;
    this.frame.style.height=frame_height;
  },

  // draw the origin
  drawOrigin: function( node ) {
    this.origin.style.left = (this.frame_left + node['position']['x']);
    this.origin.style.top = (this.frame_top + node['position']['y']);
  },

  // add an edge to the display
  addEdge: function( nodeI, nodeJ ) {
    var edge = document.createElement("div");
    edge.id = 'edge'+nodeI.id+':'+nodeJ.id;
    document.body.appendChild(edge);
  },

  // add an edge to the display
  removeEdge: function( nodeI, nodeJ ) {
    var edge = document.getElementById('edge'+nodeI.id+':'+nodeJ.id);
    document.body.removeChild(edge);
  },

  // add a node to the display
  addNode: function( node, text ) {
    var domNode;
	
	if ( text ) {
	  domNode = textNodeTmpl.cloneNode(true);
      domNode.innerHTML = text;
	} else {
      var radius = this.nodeRadius(node);
	  domNode = nodeTmpl.cloneNode(true);
      domNode.style.MozBorderRadius = (radius * 4);
      domNode.style.width = (radius*2) + "px";
      domNode.style.height = (radius*2) + "px";
	}
    domNode.id='node'+node.id;
    document.body.appendChild(domNode);
    
    domNode.style.left = parseInt(node['position']['x']);
    domNode.style.top = parseInt(node['position']['y']);

    return domNode;
  },

  // return the UI representation of the graph node
  getNode: function( nodeId ) {
    if ( nodeId == 'origin' ) {
      return document.getElementById( 'origin' );
    }
    return document.getElementById( 'node' + nodeId );
  },

  // render an edge
  drawEdge: function ( nodeI, nodeJ, distance ) {

    // edges should appear between center of nodes
    var centeri = new Object();
    centeri['x'] = this.frame_left + nodeI['position']['x'] + this.nodeRadius( nodeI );
    centeri['y'] = this.frame_top + nodeI['position']['y'] + this.nodeRadius( nodeI );

    var centerj = new Object();
    centerj['x'] = this.frame_left + nodeJ['position']['x'] + this.nodeRadius( nodeJ );
    centerj['y'] = this.frame_top + nodeJ['position']['y'] + this.nodeRadius( nodeJ );

    // get a distance vector between nodes
    var distance = new Distance();
    distance.calculate( centeri, centerj );

    // draw line
    // k+factor at end determines dot frequency
    var l = 8;
    var l = 18;
    for ( var k=0; k<l; k++ ) {
      var p = (distance['d'] / l) * k;
      var pix;

      try {
        // dom updates are expensive ... recycle where we can
        var edgeId = 'edge' + nodeI.id + ':' + nodeJ.id;
        var id = edgeId + ':' + k;
        if ( !document.getElementById(id) ) {
          pix = pixTmpl.cloneNode(true);
          pix.id = id;
          document.getElementById(edgeId).appendChild(pix);
        } else {
          pix = document.getElementById(id);
        }
        pix.style.left=centeri['x'] +(-1)*p*(distance['dx']/distance['d']);
        pix.style.top=centeri['y'] +(-1)*p*(distance['dy']/distance['d']);
      } catch ( e ) {

      }

    }
  }
}
    
// Text Node Template
var textNodeTmpl = document.createElement('div');
textNodeTmpl.style.position = 'absolute';
textNodeTmpl.style.zIndex = 3;
textNodeTmpl.style.fontFamily = "sans-serif";
textNodeTmpl.style.fontSize = "12px";
textNodeTmpl.style.textAlign = "center";
textNodeTmpl.style.height = "26px";
textNodeTmpl.style.width = "100px";

// Synset Node Template
var color = new Object();
color['adjective']="http://youarehere.kylescholz.com/cgi-bin/pinpoint.pl?title=&r=" +
  (NODE_RADIUS*2) + "&pt=8&b=656565&c=99ee55";
color['adverb']="http://youarehere.kylescholz.com/cgi-bin/pinpoint.pl?title=&r=" +
  (NODE_RADIUS*2) + "&pt=8&b=656565&c=eeee66";
color['verb']="http://youarehere.kylescholz.com/cgi-bin/pinpoint.pl?title=&r=" +
  (NODE_RADIUS*2) + "&pt=8&b=656565&c=ee9944";
color['noun']="http://youarehere.kylescholz.com/cgi-bin/pinpoint.pl?title=&r=" +
  (NODE_RADIUS*2) + "&pt=8&b=656565&c=6688ee";

var nodeTmpl = document.createElement('div');
nodeTmpl.style.position = 'absolute';
nodeTmpl.style.zIndex = 2;
nodeTmpl.style.width = (NODE_RADIUS*2) + "px";
nodeTmpl.style.height = (NODE_RADIUS*2) + "px";
nodeTmpl.innerHTML="<img height=1 width=1/>";

// Edge Point Template
var pixTmpl = document.createElement( 'div' );
pixTmpl.style.width = 2;
pixTmpl.style.height = 2;
pixTmpl.style.backgroundColor = '#888888';
pixTmpl.style.position = 'absolute';
pixTmpl.innerHTML="<img height=1 width=1/>";


//http://www.kylescholz.com/projects/force/control.js

//
// This work is licensed under the Creative Commons Attribution 2.5 License. To 
// view a copy of this license, visit
// http://creativecommons.org/licenses/by/2.5/
// or send a letter to Creative Commons, 543 Howard Street, 5th Floor, San
// Francisco, California, 94105, USA.
//
// All copies and derivatives of this source must contain the license statement 
// above and the following attribution:
//
// Author: Kyle Scholz      http://kylescholz.com/
// Copyright: 2006
//

// mouse move capture for IE
var IE = document.all?true:false;
if (!IE) document.captureEvents(Event.MOUSEMOVE)

// UserControl:
var UserControl = function(){};
UserControl.prototype = {

  initialize: function( timer, graph, ui ) {
    this['timer'] = timer;
    this['graph'] = graph;
    this['ui'] = ui;
    this['lastSelectedNode']=-1;
    this['liveNode']=-1;
    var context=this;

    // append the mousemove eventhandler
    window.onresize = function( e ) {
      return(
        context.resizeFrame( e )
      );
    };

    // append the mousemove eventhandler
    document.onmousemove = function( e ) {
      return(
        context.moveSelected( e )
      );
    };

    // append the mouseup eventhandler
    document.onmouseup = function( e ) {
      return(
        context.unselectNode( e )
      );
    };
  },

  // resize the frame when the windo size changes
  resizeFrame: function( e ) {
    var FRAME_WIDTH;
    var FRAME_HEIGHT;

    if (IE) {
      FRAME_WIDTH = document.body.offsetWidth;
      FRAME_HEIGHT = document.body.offsetHeight;
    } else {
      FRAME_WIDTH = window.innerWidth;
      FRAME_HEIGHT = window.innerHeight;
    }

    FRAME_WIDTH -= (parseInt(document.getElementById('frame').style.left)*2);
    FRAME_HEIGHT -= (parseInt(document.getElementById('frame').style.top)+20);

    this.ui['frame_width']=FRAME_WIDTH;
    this.ui['frame_height']=FRAME_HEIGHT;

    this.graph['frame_width']=FRAME_WIDTH;
    this.graph['frame_height']=FRAME_HEIGHT;

    graph.origin.position['x'] = parseInt(this.graph['frame_width']/2);
    graph.origin.position['y'] = parseInt(this.graph['frame_height']/2);

    this.ui.drawOrigin( this.graph['origin'] );
  },

  // make this node 'selected' in the graph
  selectNode: function( e, node ) {
    if ( node == this['liveNode'] ) {
        this.unattach( e, this['liveNode'] );
    } else if ( this['liveNode'] != -1 ) {
      this.graph.addEdge( graph.getNode(this['liveNode']), graph.getNode(node), 48 );
    }
    this['graph'].setSelected( node );
  },

  focusNode: function( e, node ) {
    this['liveNode'] = node;
    graphui.setLive( graph.getNode(node) );
  },

  unattach: function( e, node ) {
    if ( this['liveNode'] != -1 ) {
      var at = this['liveNode'];
      graphui.unSetLive( graph.getNode(node) );
      this['liveNode'] = -1;
    }
  },

  // unselect this node in the graph
  unselectNode: function() {
    this['lastSelectedNode'] = this['graph'].getSelected();
    this['graph'].clearSelected();
  },

  // handle mouse movement when a node is selected
  moveSelected: function( e ) {
    if ( graph.hasSelected() ) {
      var selectedNode = graph.getSelected();

      var tempX;
      var tempY;
      // get the cursor position
      if (IE) {
        tempX = event.clientX + document.body.scrollLeft;
        tempY = event.clientY + document.body.scrollTop;
      } else {
        tempX = e.pageX;
        tempY = e.pageY;
      }

      tempX -= graphui.frame_left;
      tempY -= graphui.frame_top;

      // adjust for center
      tempX -= parseInt( this.ui.getNode( selectedNode ).style.width ) / 2;
      tempY -= parseInt( this.ui.getNode( selectedNode ).style.height ) / 2;

      // set the node position
      graph.getNode( selectedNode ).position['x']=tempX;
      graph.getNode( selectedNode ).position['y']=tempY;

      // if the timer is interupted, we still want the graph to move while we move the selected node around
      if ( this.timer['interupt'] ) {
        this.graph.applyForce();
      }
    }
  },

  // 
  addEdge: function( node1, node2, weight ) {
    if ( !weight ) { weight=48; }
    this.graph.addEdge( node1, node2, weight );
  },

  // 
  addNode: function( text, mass, originEdge, originEdgeWeight ) {

    var node;
    
    if (!mass) { mass=1; }
    node = graph.addNode( mass, text );

    var domNode = this.ui.getNode( node.id );
    var context = this;

    if ( originEdge ) { 
      if ( !originEdgeWeight ) { originEdgeWeight=92 }
      this.graph.addOriginEdge( node, originEdgeWeight );
      this.ui.addEdge( node, graph.getOrigin(), originEdgeWeight );
    }

    // add a mousedown event handler
    domNode.onmousedown=function(e) {
      return(
        context.selectNode(e, node.id)
      );
    };

    return node;
  }
}

            
    