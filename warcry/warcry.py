import random
import math
import itertools
import time
import operator as op
from functools import reduce

# Default stats
strength = 3
attacks = 2
toughness = 3 
hp = 8
damage = 1
crit = 4
satk = 0
sdmg = 1
scrit = 6
shit = 4
scrithit = 6


def hit_threshold():
    return max(3, min(5, 4 + toughness - strength))

def hit_range():
    return 6-hit_threshold()

def scrit_range():
    return 7-scrithit

def srange():
    return scrithit-shit

def dmg(r):
    if r == 6:
        return crit
    elif r >= hit_threshold():
        return damage
    else:
        return 0

def sdam(r):
    if r >= scrithit:
        return scrit
    elif r >= shit:
        return sdmg
    else:
        return 0

def ncr(n, r):
    r = min(r, n-r)
    numer = reduce(op.mul, range(n, n-r, -1), 1)
    denom = reduce(op.mul, range(1, r+1), 1)
    return numer // denom

def average():
    normal  = (1/6*crit + (6-hit_threshold())/6*damage) * attacks
    special = ((7-scrithit)/6 * scrit + (scrithit-shit)/6 * sdmg) * satk
    return normal + special

# Deprecated brute-force method
def kill2():
    start_time = time.time()
    k = 0
    c = 0
    comb = []
    if attacks+satk < 10:
        comb = itertools.product(range(1,7), repeat=attacks+satk)
    else:
        for i in range(1000000):
            comb.append([random.randint(1, 6) for j in range (attacks+satk)])
    for i in comb:
        c += 1
        if sum(list(map(dmg, i[:attacks]))) + sum(list(map(sdam, i[attacks:]))) >= hp:
            k += 1
    print(k)
    print("------ {} -------".format(time.time()-start_time))
    result = k*100
    if attacks+satk < 9:
        result = result/(6 ** (attacks+satk))
    else:
        result = result/1000000
    return result

def kill():
    kills = 0
    # i is the number of crits. [0:attacks]
    for i in range(0, attacks + 1):
        # j is the number of special crits 
        for j in range(0, satk + 1):
            # k is the number of regular hits
            # for a given value of i, there can only be attacks-i
            for k in range(0, attacks + 1 - i):
                # l is the number of special hits
                # for a given value of j, there can only be satk-j
                for l in range(0, satk + 1 - j):
                    # if this combination is enough to kill, we calculate the number of it's occurences
                    if i*crit + j*scrit + k*damage + l*sdmg >= hp:
                        n = ncr(attacks, i) # arrangement of crits (one chance each)
                        n = n * ncr(satk, j)*(scrit_range()**j) # arrangement of special crits * scrit chance
                        n = n * ncr(attacks - i, k)*(hit_range()**k) # arrangement of hits * hit chance
                        n = n * ncr(satk - j, l)*(srange()**l) # arrangement of special hits * special hit chance
                        n = n * (5-hit_range())**(attacks-i-k) # possibilities of non hit & non-crit rolls for the remaining attacks
                        n = n * ((6-scrit_range()-srange())**(satk-j-l)) # possibilities of non hit & non-crit rolls for the remaining special attacks
                        kills += n
    return kills/(6**(attacks+satk))*100

def printstats():
    print("Strength: {}\nAttacks: {}\nDefense: {}\nHit Points: {}\nDamage: {}\nCritical: {}".format(strength, attacks, toughness, hp, damage, crit))
    if satk > 0:
        print("Special Attacks: {}\nSpecial Attack damage: {}\nSpecial Attack crit damage: {}\nSpecial Attack hit: {}\nSpecial Attack crit hit: {}".format(satk, sdmg, scrit, shit, scrithit))

def parse_com(command):
    global strength, attacks, toughness, hp, damage, crit, satk, sdmg, scrit, shit, scrithit

    if command == "str":
        print("Enter Strength value:")
        strength = int(input())
    elif command == "atk":
        print("Enter Attacks value:")
        attacks = int(input())
    elif command == "def":
        print("Enter Defense value:")
        toughness = int(input())
    elif command == "hp":
        print("Enter Hit Points value:")
        hp = int(input())
    elif command == "dmg":
        print("Enter Damage value:")
        damage = int(input())
    elif command == "crit":
        print("Enter Critical value:")
        crit = int(input())
    elif command == "satk":
        print("Enter Special Attack number:")
        satk = int(input())
    elif command == "sdmg":
        print("Enter Special Attack damage:")
        sdmg = int(input())
    elif command == "scritd":
        print("Enter Special Attack crit damage:")
        scrit = int(input())
    elif command == "shit":
        print("Enter Special Attack Hit value (1 for auto-hit):")
        shit = int(input())
    elif command == "scrith":
        print("Enter Special Attack critical hit value (7 for none):")
        scrithit = int(input())
    elif command == "sim":
        print("Average dmg: ", average())
        print("Chance to kill target (%): ", kill())
    elif command == "stats":
        printstats()
    elif command == "comp":
        compare()
    elif command == "help":
        print("Available commands:\nsim\nstats\nstr\natk\ndef\nhp\ndmg\ncrit\nSpecial attack section:\nsatk\nsdmg\nscritd\nshit\nscrith\ncomp")
    else:
        print("Unrecognized command")


def compare():
    global strength, attacks, toughness, hp, damage, crit, satk, sdmg, scrit, shit, scrithit
    c_strength = strength 
    c_attacks = attacks
    c_toughness = toughness
    c_hp = hp
    c_damage = damage
    c_crit = crit
    c_satk = satk
    c_sdmg = sdmg
    c_scrit = scrit
    c_shit = shit
    c_scrithit = scrithit

    command = ""
    while True:
        print("Enter stat to change or sim:")
        command = input()
        if command == "comp":
            print("Already comparing")
        elif command == "sim":
            break
        else:
            try:
                parse_com(command)
            except ValueError:
                print("Not a number")
                continue
    printstats()
    print("Average dmg: ", average())
    print("Chance to kill target (%): ", kill())
    print("-----------------------------------------")
    strength = c_strength 
    attacks = c_attacks
    toughness = c_toughness
    hp = c_hp
    damage = c_damage
    crit = c_crit
    satk = c_satk
    sdmg = c_sdmg
    scrit = c_scrit
    shit = c_shit
    scrithit = c_scrithit

    printstats()
    print("Average dmg: ", average())
    print("Chance to kill target (%): ", kill())



printstats()
while True:
    print("Enter command:")
    command = input()
    try:
        parse_com(command)
    except ValueError:
        print("Not a number")
        continue















