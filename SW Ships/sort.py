#! /bin/python3
import re
import requests
from operator import itemgetter, attrgetter

f = open("data.txt", "r")
l = "ini"
r=requests.get("http://swrpg.viluppo.net/transportation/starships/").text

class Ship:
    name = "-"
    silhouette = "-"
    spd = "-"
    handling = "-"
    crew = "-"
    encumbrance = "-"
    passenger = "-"
    cost = "-"
    hp = "-"
    weapons = "-"
    defenses = ["-", "-", "-", "-"]
    armor = "-"
    ht = "-"
    ss = "-"
    notes = "-"
    link = ""
    
    
    def __init__(self, name):
        self.name = name
    def toString(self):
        return str(self.name) + "\n" + str(self.silhouette) + "\t" + str(self.spd) + "\t" + str(self.handling) + "\t" + str(self.crew) + "\t" + str(self.encumbrance) + "\t" + str(self.passenger) + "\t" + str(self.cost) + "\t" + str(self.hp) + "\t" + str(self.weapons) + "\t" + str(s.defenses) + "\t" + str(s.armor) + "\t" + str(s.ht) + "\t" + str(s.ss) + "\t" + str(s.notes)
    def toCSV(self):
        return str(self.name) + ", " + str(self.silhouette) + ", " + str(self.spd) + ", " + str(self.handling) + ", " + str(self.crew) + ", " + str(self.encumbrance) + ", " + str(self.passenger) + ", " + str(self.cost) + ", " + str(self.hp) + ", " + str(self.weapons) + ", " + re.sub("[\'\[\]]", "", str(s.defenses)) + ", " + str(s.armor) + ", " + str(s.ht) + ", " + str(s.ss) + ", " + str(s.notes) + ", " + s.link + "\n"
        
     
all_ships = []



l = 'init'
while(l != ['']):
    l=f.readline()[:-1]
    if(l!=""): s = Ship(l)
    l=f.readline().split("\t")
    if(l!=['']):
        s.silhouette = int(l[1])
        s.spd = int(l[2])
        s.handling = int(l[3])
        s.crew = int(l[7])
        s.encumbrance = int(l[8])
        s.passenger = int(l[9])
        s.cost = int(re.sub("[^0-9]", "", l[10]))
        s.hp = (l[12])
        s.weapons = (l[13])
        
    if (s.silhouette >=3 and s.silhouette <=5 and s.crew + s.passenger >=6 and s.cost<=1000000):
        ref = re.search('href=\"(.*)\">'+re.sub("'", "&#39;", s.name), r)
        if (ref != None):
            ref = ref.group(1)
            ship_page = requests.get("http://swrpg.viluppo.net"+ref)
            if ship_page.status_code == 200:
                txt = ship_page.text
                s.link = "http://swrpg.viluppo.net" + ref
                s.defenses = [re.search("(?<=def_fore\">).", txt).group(), re.search("(?<=def_port\">).", txt).group(), re.search("(?<=def_starboard\">).", txt).group(), re.search("(?<=def_aft\">).", txt).group()]
                s.armor = re.search("Armor.*item_value\">(\d*)", txt).group(1)
                s.ht = int(re.search("HT Threshold.*item_value\">(\d*)", txt).group(1))
                s.ss = int(re.search("SS Threshold.*item_value\">(\d*)", txt).group(1))             
                n = re.search("Notes.*item_notes\"> (.*)", txt)
                if (n!=None): s.notes = re.sub("\<\/span\>|Image .*|[\;\,\n]", "", n.group(1))
                
        all_ships.append(s)
    

all_ships = sorted(all_ships, key=attrgetter('silhouette', 'spd', 'handling', 'hp', 'weapons'), reverse=True)
        
r = open("res.csv", "w")
r.write("Name, Silhouette, Speed, Handling, Crew, Encumbrance, Passengers, Cost, Hard Points, Weapons, Fore, Port, Starboard, Aft, Armor, Hull, System Strain, Notes, Link\n")
for s in all_ships:
    print(s.toString())
    r.write(s.toCSV())
