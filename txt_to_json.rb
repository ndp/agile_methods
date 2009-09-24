require 'rubygems'
require 'activesupport'

def to_var(s)
	s.to_s.strip.downcase.underscore.gsub(/\(.*\)/,'').gsub(/[^a-z]+/,'_').gsub(/_+$/,'').strip
end

def to_label(s)
  s.gsub(/\(.*\)/,'').strip
end


puts 'var nodes = {};'
puts 'var edges = {};'


columns = 7
lines = File.readlines('agile_methods.txt')
lines.shift
headers = []
7.times { headers << lines.shift } 
headers.shift

headers.each do |h|
	next if h.blank?
	label = to_label(h)
	k = to_var(h)
    puts "nodes['" + k + "'] = { label: '" + label + "', mass: 3, origin: true, cssClass: 'method'};"
end


7.times { lines.shift } 
lines.each_slice(columns) do |slice|
	label = to_label(slice.shift)
	next if label.blank?
	next unless slice.any? {|s| !s.blank? && s.to_i < 10}
	k = to_var(label) 
    puts "nodes['" + k + "'] = { label: '" + label + "', mass: 2, cssClass: 'attr'};"
    
    headers.each_with_index do |header, i|
    	next if slice[i].blank?
    	wt = 80 - (slice[i].to_i * 5)
    	wt = 10 if wt < 10
    	headerk = to_var(header)
    	puts "edges['#{headerk+k}'] = { nodeA: '#{headerk}', nodeB: '#{k}', weight: #{wt}}"
    end
    
    
end

