import json

jsonfile = open("prog_languages.json")

jsonobject = json.load(jsonfile)

file_extensions = []

for element in jsonobject:
	if "extensions" in element:
		for extension in element["extensions"]:
			print(extension)
			file_extensions.append(extension)
	else:
		print("no extensions")

#output_file = open("prog_extensions_string.txt", "w")

output_string = "\""

for extension in file_extensions:
	#output_file.write(extension + "\n")
	output_string += (extension + ",")	


formatted_output = output_string.rstrip(output_string[-1])

formatted_output += "\""

print(formatted_output)

#output_file.write(''.join(str(ext) for ext in file_extensions))





