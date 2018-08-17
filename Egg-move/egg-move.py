#! /bin/python3
import re
import requests
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("pokemon")
parser.add_argument("--extra-moves", nargs="*")
parser.add_argument("--other", action="store_true")

args = parser.parse_args()
print(args)
print(args.pokemon)

smogon_url = "https://www.smogon.com/dex/sm/pokemon/"+args.pokemon
pokedb_url = "https://pokemondb.net/pokedex/"+args.pokemon

smogon_moves = "moveslots\":\[(\[.*?\])\]"
smogon_page = requests.get(smogon_url).text

smogon_learnset = re.search("learnset\":\[(.*?)\]", smogon_page).group(1)
learnset = []

for i in re.finditer("\"(.*?)\"", smogon_learnset):
	learnset.append(i.group(1))
learnset = list(set(learnset))

m = re.finditer(smogon_moves, smogon_page)
moveList = []
for i in m:
	moves = i.group(1).split(",")
	for j in moves:
		moveList.append(re.sub("[\[\]\"]",  "", j))

if args.other:
	for i in learnset:
		if len(re.findall(i, smogon_page)) > 1:
			moveList.append(i)	
	
moveList = list(set(moveList + (args.extra_moves if args.extra_moves != None else [])))
print(moveList)

f = open("tmp", "w")
pokedb_page = requests.get(pokedb_url).text
pokedb_page = pokedb_page.split("Moves learnt by level")[1]
pokedb_page = pokedb_page.split("Egg moves")
normal = pokedb_page[0]
f.write(pokedb_page[1])
pokedb_page = pokedb_page[1].split("Move Tutor moves")
egg = pokedb_page[0]
pokedb_page = pokedb_page[1].split("Transfer-only moves")
normal += "\n" + pokedb_page[0]
if len(pokedb_page) > 1:
	transfer = pokedb_page[1]


for i in moveList:
	if re.search(i, normal) != None:
		print(i, " is ok")
	elif re.search(i, egg) != None:
		print(i, " is an egg-move")
	else:
		print(i, " not found")
