import pandas as pd
import regex as re
from collections import Counter
from itertools import combinations

loc = r'C:\Users\josep\OneDrive\Desktop\scripts\beauty-script.txt'

all_text = open(loc, 'r').read().split(')\n\n')

def get_character_names(text):
    name_list = []
    lines = text.split('\n')
    for line in lines:
        if line != '':
            try:
                position = line.index(":\t")
                name = line[:position]
                name_list.append(name)
            except:
                pass
    return name_list

name_list = []
for scene in all_text:
    names = get_character_names(scene)
    name_list.append(names)

name_list_flat = [i for sublist in name_list for i in sublist]
name_list_dict = dict(Counter(name_list_flat))
names_df = pd.DataFrame({'name':name_list_dict.keys(), 'count':name_list_dict.values()}).sort_values(by = ['count'], ascending = False)
names_df = names_df[:9].reset_index()[['name', 'count']]

def get_interactions(input_list):
    counts = dict(Counter(input_list))
    combs_names = list(combinations(counts, 2))
    combs_scores = []
    for i in combs_names:
        val_1 = counts.get(i[0])
        val_2 = counts.get(i[1])
        score = (val_1 + val_2)/2
        combs_scores.append(score)
    interactions = pd.DataFrame(combs_names, columns = ['name1', 'name2'])
    interactions['score'] = combs_scores
    return interactions

df = pd.DataFrame(columns=['name1', 'name2', 'score'])

for scene in all_text:
    sub_df = get_interactions(get_character_names(scene))
    df = pd.concat([df, sub_df], ignore_index=True)

def return_uni_name(text1, text2):
    text1 = text1.replace(" ", '')
    text2 = text2.replace(" ", '')
    if text1<text2:
        return text1+"_"+text2
    else:
        return text2+"_"+text1

df['uni_name'] = df.apply(lambda row: return_uni_name(row['name1'], row['name2']), axis = 1)
df = df.groupby('uni_name').agg({'name1':'first', 'name2':'first', 'score': "sum"})

df = df.sort_values(by = ['score'], ascending = False)[:17].reset_index(drop = True)

def get_row_index(input_list, value):
    return list(input_list).index(value)

df['source'] = df.apply(lambda row: get_row_index(names_df['name'], row['name1']), axis = 1)
df['target'] = df.apply(lambda row: get_row_index(names_df['name'], row['name2']), axis = 1)

out_loc = r"C:\Users\josep\OneDrive\Desktop\scripts"

df.to_csv(out_loc + r'\beauty_relationship.csv', index = False)
names_df.to_csv(out_loc + r'\beauty_characters.csv', index = False)








