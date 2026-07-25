import json

with open('figma_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def rgba_to_hex(color):
    return '#{:02x}{:02x}{:02x}'.format(int(color['r']*255), int(color['g']*255), int(color['b']*255))

lines = []

def parse_node(node, depth=0):
    indent = '  ' * depth
    node_type = node.get('type', 'UNKNOWN')
    name = node.get('name', '')
    
    info = f'{indent}- {node_type}: "{name}"'
    
    if 'characters' in node:
        chars = node['characters'].replace('\n', ' ').replace('\u2028', ' ')
        info += f' => TEXT: "{chars}"'
        
        style = node.get('style', {})
        font_size = style.get('fontSize', '')
        font_family = style.get('fontFamily', '')
        font_weight = style.get('fontWeight', '')
        info += f' [Font: {font_family} {font_size}px (Weight: {font_weight})]'
        
        if 'fills' in node:
            for fill in node['fills']:
                if fill.get('type') == 'SOLID':
                    info += f' [Color: {rgba_to_hex(fill.get("color"))}]'
    elif 'fills' in node:
        for fill in node['fills']:
            if fill.get('type') == 'SOLID':
                info += f' [BG: {rgba_to_hex(fill.get("color"))}]'
                
    if 'absoluteBoundingBox' in node:
        bbox = node['absoluteBoundingBox']
        info += f' (W:{bbox.get("width")} H:{bbox.get("height")})'
        
    lines.append(info)
    
    if 'children' in node:
        for child in node['children']:
            parse_node(child, depth + 1)

nodes = data.get('nodes', {})
if '1:8' in nodes:
    lines.append("--- FIGMA NODE 1:8 STRUCTURE ---")
    parse_node(nodes['1:8']['document'])
else:
    lines.append(f'Node 1:8 not found in keys: {list(nodes.keys())}')

with open('figma_summary.txt', 'w', encoding='utf-8') as out_f:
    out_f.write('\n'.join(lines))
print("Successfully generated figma_summary.txt")
