var nodes = {};
var edges = {};

var methods = {
    xp: 'XP',
    agile_manifesto: 'Agile Manifesto',
    scrum: 'Scrum',
    lean: 'Lean',
    getting_real: 'Getting Real',
    software_craftsmanship: 'Software Craftsmanship'
};

for (i in methods) {
    nodes[i] = {
        label: methods[i],
        mass: 3,
        origin: false,
        cssClass: 'method'
    }
}


var values = {
    'backlog':'Backlog',
    'build_integrity_in':'Build integrity in',
    'collaborate_with_customers':'Collaborate with Customers',
    'collaborators':'Collaborators',
    'colocation':'Colocation',
    'commitment':'Commitment',
    'communication':'Communication',
    'community_of_professionals':'Community of professionals',
    'constantly_improving':'Constantly Improving',
    'courage':'Courage',
    'cross_functional_teams':'Cross-Functional Teams',
    'customer_satisfaction':'Customer Satisfaction',
    'decide_as_late_as_possible':'Decide as late as possible',
    'deliver_early':'Deliver Early',
    'delivery_needs':'Delivery Needs',
    'eliminate_waste':'Eliminate waste',
    'eliminate_what_customers_don_t_need':'Eliminate what customers don\'t need',
    'empirical_approach':'Empirical Approach',
    'equal_partners':'Equal Partners',
    'face_to_face_communication':'Face-to-face communication',
    'feedback':'Feedback',
    'focus':'Focus',
    'helping_others_learn_the_craft':'Helping others learn the craft',
    'high_productivity':'High Productivity',
    'holistic':'Holistic',
    'individuals':'Individuals',
    'iteration_sprint':'Iteration/Sprint',
    'lowering_cost_of_change':'Lowering Cost of Change',
    'openness':'Openness',
    'overlapping_phases':'Overlapping Phases',
    'partnerships':'Partnerships',
    'practices':'Practices',
    'predefined_roles':'Predefined Roles',
    'respect':'Respect',
    'respond_to_change':'Respond to Change',
    'self_organizing':'Self-Organizing',
    'simple_environment':'Simple Environment',
    'simplicity':'Simplicity',
    'smarter_better_faster':'Smarter, better, faster',
    'staying_small':'Staying Small',
    'steadily_adding_value':'Steadily adding value',
    'sustainable_development':'Sustainable Development',
    'team_reflections':'Team Reflections',
    'teamwork':'Teamwork',
    'technical_excellence':'Technical Excellence',
    'tweaking':'Tweaking',
    'well_crafted_software':'Well-crafted software',
    'working_software':'Working Software'
};

for (i in values) {
    nodes[i] = { label: values[i], mass: 2, cssClass: 'attr'};
}


var weightings = [
    ['agile_manifesto', 'collaborate_with_customers', 45],
    ['agile_manifesto', 'customer_satisfaction', 35],
    ['agile_manifesto', 'face_to_face_communication', 60],
    ['agile_manifesto', 'individuals', 35],
    ['agile_manifesto', 'respond_to_change', 50],
    ['agile_manifesto', 'self_organizing', 80],
    ['agile_manifesto', 'simplicity', 80],
    ['agile_manifesto', 'sustainable_development', 70],
    ['agile_manifesto', 'team_reflections', 80],
    ['agile_manifesto', 'technical_excellence', 75],
    ['agile_manifesto', 'working_software', 40],
    ['getting_real', 'constantly_improving', 80],
    ['getting_real', 'deliver_early', 70],
    ['getting_real', 'delivery_needs', 80],
    ['getting_real', 'eliminate_what_customers_don_t_need', 80],
    ['getting_real', 'iteration_sprint', 60],
    ['getting_real', 'lowering_cost_of_change', 65],
    ['getting_real', 'respond_to_change', 55],
    ['getting_real', 'simplicity', 45],
    ['getting_real', 'smarter_better_faster', 35],
    ['getting_real', 'staying_small', 50],
    ['getting_real', 'tweaking', 75],
    ['getting_real', 'working_software', 40],
    ['lean', 'build_integrity_in', 60],
    ['lean', 'decide_as_late_as_possible', 45],
    ['lean', 'eliminate_waste', 35],
    ['lean', 'feedback', 40],
    ['lean', 'holistic', 65],
    ['lean', 'self_organizing', 55],
    ['lean', 'working_software', 50],
    ['software_craftsmanship', 'collaborate_with_customers', 75],
    ['software_craftsmanship', 'community_of_professionals', 45],
    ['software_craftsmanship', 'constantly_improving', 55],
    ['software_craftsmanship', 'helping_others_learn_the_craft', 55],
    ['software_craftsmanship', 'individuals', 70],
    ['software_craftsmanship', 'partnerships', 50],
    ['software_craftsmanship', 'respond_to_change', 65],
    ['software_craftsmanship', 'steadily_adding_value', 40],
    ['software_craftsmanship', 'well_crafted_software', 35],
    ['software_craftsmanship', 'working_software', 60],
    ['scrum', 'backlog', 70],
    ['scrum', 'colocation', 80],
    ['scrum', 'commitment', 35],
    ['scrum', 'courage', 55],
    ['scrum', 'cross_functional_teams', 45],
    ['scrum', 'empirical_approach', 80],
    ['scrum', 'focus', 40],
    ['scrum', 'holistic', 35],
    ['scrum', 'iteration_sprint', 60],
    ['scrum', 'openness', 45],
    ['scrum', 'overlapping_phases', 40],
    ['scrum', 'practices', 50],
    ['scrum', 'predefined_roles', 55],
    ['scrum', 'respect', 50],
    ['scrum', 'respond_to_change', 80],
    ['scrum', 'self_organizing', 75],
    ['scrum', 'working_software', 65],
    ['xp', 'collaborators', 60],
    ['xp', 'communication', 75],
    ['xp', 'customer_satisfaction', 35],
    ['xp', 'deliver_early', 75],
    ['xp', 'equal_partners', 55],
    ['xp', 'feedback', 75],
    ['xp', 'high_productivity', 65],
    ['xp', 'respond_to_change', 45],
    ['xp', 'self_organizing', 70],
    ['xp', 'simple_environment', 65],
    ['xp', 'simplicity', 75],
    ['xp', 'teamwork', 50],
    ['xp', 'working_software', 40]
];

for (i = 0; i < weightings.length; i++) {
    var weighting = weightings[i];
    edges[weighting[0] + weighting[1]] = { nodeA: weighting[0], nodeB: weighting[1], weight: weighting[2]}
}

