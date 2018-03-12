"""This module pulls data from the My Sports Feeds API."""
import psycopg2
import requests

auth = ('zschulze', 'spunky730')


def connect_to_db():
    """Connect to the database"""

    try:
        conn = psycopg2.connect(
            "dbname='salaryfs' user='salaryfs' host='localhost' password='password'")
    except:
        print("Unable to connect to db")
        sys.exit("Exiting...")

    print("Successfully connected to db")
    cur = conn.cursor()
    execute(conn, cur)


def execute(conn, cur):
    """Execute API calls"""

    save_active_players(cur)
    #save_cumulative_player_stats(cur)
    save_full_game_schedule(cur)
    cur.execute("""SELECT id FROM msf_game""")
    games = cur.fetchall()
    for game in games:
        save_game_boxscore(cur, game[0])

    conn.commit()
    cur.close()
    conn.close()


def save_full_game_schedule(cur):
    """Call the Full Game Schedule API"""

    print("Calling Full Game Schedule API")
    response = requests.get(
        'https://api.mysportsfeeds.com/v1.2/pull/nfl/2018-playoff/full_game_schedule.json', auth=auth)

    games = []

    if response.status_code == requests.codes.ok and response.json() is not None:
        print("Response code ok, converting json data into lists of python objects")
        fullgameschedule = response.json()['fullgameschedule']
        print("Last updated on - ", fullgameschedule['lastUpdatedOn'])
        gameentry = fullgameschedule['gameentry']
        for gameentry in gameentry:
            away_team = gameentry['awayTeam']
            home_team = gameentry['homeTeam']

            games.append({
                'id': gameentry['id'],
                'season': '2018-playoff',
                'week': gameentry['week'],
                'schedule_status': gameentry.get('scheduleStatus'),
                'original_date': gameentry.get('originalDate'),
                'original_time': gameentry.get('originalTime'),
                'delayed_or_postponed_reason': gameentry.get('delayedOrPostponedReason'),
                'actual_date': gameentry['date'],
                'actual_time': gameentry['time'],
                'msf_team_away_id': away_team['ID'],
                'msf_team_home_id': home_team['ID'],
                'location': gameentry['location']
            })

        print("Saving games to DB")
        cur.executemany("""INSERT INTO msf_game(id,season,week,schedule_status,original_date,original_time,delayed_or_postponed_reason,actual_date,actual_time,msf_team_away_id,msf_team_home_id,location) VALUES (
            %(id)s,
			%(season)s,
            %(week)s,
            %(schedule_status)s,
            %(original_date)s,
            %(original_time)s,
            %(delayed_or_postponed_reason)s,
            %(actual_date)s,
            %(actual_time)s,
            %(msf_team_away_id)s,
            %(msf_team_home_id)s,
            %(location)s
        )
        ON CONFLICT (id) DO UPDATE SET
			season = %(season)s,
            week = %(week)s,
            schedule_status = %(schedule_status)s,
            original_date = %(original_date)s,
            original_time = %(original_time)s,
            delayed_or_postponed_reason = %(delayed_or_postponed_reason)s,
            actual_date = %(actual_date)s,
            actual_time = %(actual_time)s,
            msf_team_away_id = %(msf_team_away_id)s,
            msf_team_home_id = %(msf_team_home_id)s,
            location = %(location)s
        """, games)

    else:
        print("Reponse code not ok - failure")


def save_active_players(cur):
    """Call the Active Players API"""

    print("Calling Active Players API")
    response = requests.get(
        'https://api.mysportsfeeds.com/v1.2/pull/nfl/2017-regular/active_players.json', auth=auth)

    teams = []
    players = []

    if response.status_code == requests.codes.ok and response.json() is not None:
        print("Response code ok, converting json data into lists of python objects")
        activateplayers = response.json()['activeplayers']
        print("Last updated on - ", activateplayers['lastUpdatedOn'])
        playerentry = activateplayers['playerentry']
        for playerentry in playerentry:
            team = playerentry.get('team')
            player = playerentry['player']
            if team is not None:
                teams.append({
                    'id': team['ID'],
                    'city': team['City'],
                    'name': team['Name'],
                    'abbreviation': team['Abbreviation']
                })
            else:
                team = {}

            players.append({
                'id': player['ID'],
                'last_name': player['LastName'],
                'first_name': player['FirstName'],
                'jersey_number': player.get('JerseyNumber'),
                'position': player['Position'],
                'height': player.get('Height'),
                'weight': player.get('Weight'),
                'birth_date': player.get('BirthDate'),
                'age': player.get('Age'),
                'birth_city': player.get('BirthCity'),
                'birth_country': player.get('BirthCountry'),
                'is_rookie': player['IsRookie'],
                'msf_team_id': team.get('ID')
            })

        print("Saving teams to DB")
        cur.executemany("""INSERT INTO msf_team(id,city,name,abbreviation) VALUES (
            %(id)s,
            %(city)s,
            %(name)s,
            %(abbreviation)s
        )
        ON CONFLICT (id) DO UPDATE SET
            city = %(city)s,
            name = %(name)s,
            abbreviation = %(abbreviation)s
        """, teams)

        print("Saving players to DB")
        cur.executemany("""INSERT INTO msf_player(id,last_name,first_name,jersey_number,position,height,weight,birth_date,age,birth_city,birth_country,is_rookie,msf_team_id) VALUES (
            %(id)s,
            %(last_name)s,
            %(first_name)s,
            %(jersey_number)s,
            %(position)s,
            %(height)s,
            %(weight)s,
            %(birth_date)s,
            %(age)s,
            %(birth_city)s,
            %(birth_country)s,
            %(is_rookie)s,
            %(msf_team_id)s
        )
        ON CONFLICT (id) DO UPDATE SET
            last_name = %(last_name)s,
            first_name = %(first_name)s,
            jersey_number = %(jersey_number)s,
            position = %(position)s,
            height = %(height)s,
            weight = %(weight)s,
            birth_date = %(birth_date)s,
            age = %(age)s,
            birth_city = %(birth_city)s,
            birth_country = %(birth_country)s,
            is_rookie = %(is_rookie)s,
            msf_team_id = %(msf_team_id)s
        """, players)

    else:
        print("Reponse code not ok - failure")


def save_cumulative_player_stats(cur):
    """Call the Cumulative Player Stats API"""

    print("Calling Cumulative Player Stats API")
    response = requests.get(
        'https://api.mysportsfeeds.com/v1.2/pull/nfl/2017-regular/cumulative_player_stats.json', auth=auth)

    players = []
    player_stats = []

    if response.status_code == requests.codes.ok and response.json() is not None:
        print("Response code ok, converting json data into lists of python objects")
        cumulativeplayerstats = response.json()['cumulativeplayerstats']
        print("Last updated on - ", cumulativeplayerstats['lastUpdatedOn'])
        playerstatsentry = cumulativeplayerstats['playerstatsentry']
        for playerstatsentry in playerstatsentry:
            player = playerstatsentry['player']
            team = playerstatsentry['team']
            stats = playerstatsentry['stats']

            players.append({
                'id': player['ID'],
                'last_name': player['LastName'],
                'first_name': player['FirstName'],
                'jersey_number': player.get('JerseyNumber'),
                'position': player['Position'],
                'msf_team_id': team['ID']
            })

            for stat in stats:
                current_stat = stats[stat]
                player_stats.append({
                    'stat_name': stat,
                    'stat_category': current_stat.get('@category'),
                    'stat_abbreviation': current_stat['@abbreviation'],
                    'stat_text': current_stat['#text'],
                    'msf_player_id': player['ID']
                })

        print("Saving players to DB")
        cur.executemany("""INSERT INTO msf_player(id,last_name,first_name,jersey_number,position,msf_team_id) VALUES (
            %(id)s,
            %(last_name)s,
            %(first_name)s,
            %(jersey_number)s,
            %(position)s,
            %(msf_team_id)s
        )
        ON CONFLICT (id) DO UPDATE SET
            last_name = %(last_name)s,
            first_name = %(first_name)s,
            jersey_number = %(jersey_number)s,
            position = %(position)s,
            msf_team_id = %(msf_team_id)s
        """, players)

        print("Saving stats to DB")
        cur.executemany("""INSERT INTO msf_player_season_stats(stat_name,stat_category,stat_abbreviation,stat_text,msf_player_id) VALUES (
            %(stat_name)s,
            %(stat_category)s,
            %(stat_abbreviation)s,
            %(stat_text)s,
            %(msf_player_id)s
        )
        ON CONFLICT (stat_name,stat_category,stat_abbreviation,msf_player_id) DO UPDATE SET
            stat_text = %(stat_text)s
        """, player_stats)

    else:
        print("Reponse code not ok - failure")


def save_game_boxscore(cur, game_id):
    """Call the Game Boxscore API"""

    print("Calling Game BoxScore API for Game -",game_id)
    payload = {'gameid': game_id}
    response = requests.get(
        'https://api.mysportsfeeds.com/v1.2/pull/nfl/2017-regular/game_boxscore.json', auth=auth, params=payload)

    player_stats = []

    if response.status_code == requests.codes.ok and response.json() is not None:
        print("Response code ok, converting json data into lists of python objects")
        gameboxscore = response.json()['gameboxscore']
        print("Last updated on - ", gameboxscore['lastUpdatedOn'])
        away_team = gameboxscore['awayTeam']
        away_team_id = gameboxscore['game']['awayTeam']['ID']
        away_players = away_team['awayPlayers']
        away_player_entries = away_players['playerEntry']
        home_team = gameboxscore['homeTeam']
        home_team_id = gameboxscore['game']['homeTeam']['ID']
        home_players = home_team['homePlayers']
        home_player_entries = home_players['playerEntry']
        stats = {}

        for player_entry in away_player_entries:
            player = player_entry['player']
            stats = player_entry.get('stats',{})
            # Sometimes stats can be null
            if stats is None:
                stats = {}

            player_stats.append({
                'msf_player_id': player['ID'],
                'msf_game_id': payload['gameid'],
                'msf_team_id': away_team_id,
                'pass_att': stats.get('PassAttempts',{}).get('#text'),
                'pass_comp': stats.get('PassCompletions',{}).get('#text'),
                'pass_pct': stats.get('PassPct',{}).get('#text'),
                'pass_yds': stats.get('PassYards',{}).get('#text'),
                'pass_avg': stats.get('PassAvg',{}).get('#text'),
                'pass_yds_per_att': stats.get('PassYardsPerAtt',{}).get('#text'),
                'pass_td': stats.get('PassTD',{}).get('#text'),
                'pass_td_pct': stats.get('PassTDPct',{}).get('#text'),
                'pass_int': stats.get('PassInt',{}).get('#text'),
                'pass_int_pct': stats.get('PassIntPct',{}).get('#text'),
                'pass_lng': stats.get('PassLng',{}).get('#text'),
                'pass_20_plus': stats.get('Pass20Plus',{}).get('#text'),
                'pass_40_plus': stats.get('Pass40Plus',{}).get('#text'),
                'pass_sacks': stats.get('PassSacks',{}).get('#text'),
                'pass_sack_y': stats.get('PassSackY',{}).get('#text'),
                'qb_rating': stats.get('QBRating',{}).get('#text'),
                'rush_att': stats.get('RushAttempts',{}).get('#text'),
                'rush_yds': stats.get('RushYards',{}).get('#text'),
                'rush_avg': stats.get('RushAverage',{}).get('#text'),
                'rush_td': stats.get('RushTD',{}).get('#text'),
                'rush_lng': stats.get('RushLng',{}).get('#text'),
                'rush_20_plus': stats.get('Rush20Plus',{}).get('#text'),
                'rush_40_plus': stats.get('Rush40Plus',{}).get('#text'),
                'rush_fum': stats.get('RushFumbles',{}).get('#text'),
                'rec_tgt': stats.get('Targets',{}).get('#text'),
                'rec_rec': stats.get('Receptions',{}).get('#text'),
                'rec_yds': stats.get('RecYards',{}).get('#text'),
                'rec_avg': stats.get('RecAverage',{}).get('#text'),
                'rec_td': stats.get('RecTD',{}).get('#text'),
                'rec_lng': stats.get('RecLng',{}).get('#text'),
                'rec_20_plus': stats.get('Rec20Plus',{}).get('#text'),
                'rec_40_plus': stats.get('Rec40Plus',{}).get('#text'),
                'rec_fum': stats.get('RecFumbles',{}).get('#text'),
                'tackle_solo': stats.get('TackleSolo',{}).get('#text'),
                'tackle_total': stats.get('TackleTotal',{}).get('#text'),
                'tackle_ast': stats.get('TackleAst',{}).get('#text'),
                'sacks': stats.get('Sacks',{}).get('#text'),
                'sack_yds': stats.get('SackYds',{}).get('#text'),
                'sfty': stats.get('Safeties',{}).get('#text'),
                'tackles_for_loss': stats.get('TacklesForLoss',{}).get('#text'),
                'interceptions': stats.get('Interceptions',{}).get('#text'),
                'int_td': stats.get('IntTD',{}).get('#text'),
                'int_yds': stats.get('IntYds',{}).get('#text'),
                'int_avg': stats.get('IntAverage',{}).get('#text'),
                'int_lng': stats.get('IntLng',{}).get('#text'),
                'passes_defended': stats.get('PassesDefended',{}).get('#text'),
                'stuffs': stats.get('Stuffs',{}).get('#text'),
                'stuff_yds': stats.get('StuffYds',{}).get('#text'),
                'kb': stats.get('KB',{}).get('#text'),
                'fum': stats.get('Fumbles',{}).get('#text'),
                'fum_lost': stats.get('FumLost',{}).get('#text'),
                'fum_forced': stats.get('FumForced',{}).get('#text'),
                'fum_own_rec': stats.get('FumOwnRec',{}).get('#text'),
                'fum_opp_rec': stats.get('FumOppRec',{}).get('#text'),
                'fum_rec_yds': stats.get('FumRecYds',{}).get('#text'),
                'fum_total_rec': stats.get('FumTotalRec',{}).get('#text'),
                'fum_td': stats.get('FumTD',{}).get('#text'),
                'kr_ret': stats.get('KrRet',{}).get('#text'),
                'kr_yds': stats.get('KrYds',{}).get('#text'),
                'kr_avg': stats.get('KrAvg',{}).get('#text'),
                'kr_lng': stats.get('KrLng',{}).get('#text'),
                'kr_td': stats.get('KrTD',{}).get('#text'),
                'kr_20_plus': stats.get('Kr20Plus',{}).get('#text'),
                'kr_40_plus': stats.get('Kr40Plus',{}).get('#text'),
                'kr_fc': stats.get('KrFC',{}).get('#text'),
                'kr_fum': stats.get('KrFum',{}).get('#text'),
                'pr_ret': stats.get('PrRet',{}).get('#text'),
                'pr_yds': stats.get('PrYds',{}).get('#text'),
                'pr_avg': stats.get('PrAvg',{}).get('#text'),
                'pr_lng': stats.get('PrLng',{}).get('#text'),
                'pr_td': stats.get('PrTD',{}).get('#text'),
                'pr_20_plus': stats.get('Pr20Plus',{}).get('#text'),
                'pr_40_plus': stats.get('Pr40Plus',{}).get('#text'),
                'pr_fc': stats.get('PrFC',{}).get('#text'),
                'pr_fum': stats.get('PrFum',{}).get('#text'),
                'two_pt_att': stats.get('TwoPtAtt',{}).get('#text'),
                'two_pt_made': stats.get('TwoPtMade',{}).get('#text'),
                'two_pt_pass_att': stats.get('TwoPtPassAtt',{}).get('#text'),
                'two_pt_pass_made': stats.get('TwoPtPassMade',{}).get('#text'),
                'two_pt_pass_rec': stats.get('TwoPtPassRec',{}).get('#text'),
                'two_pt_rush_att': stats.get('TwoPtRushAtt',{}).get('#text'),
                'two_pt_rush_made': stats.get('TwoPtRushMade',{}).get('#text'),
                'fg_blk': stats.get('FgBlk',{}).get('#text'),
                'fg_made': stats.get('FgMade',{}).get('#text'),
                'fg_att': stats.get('FgAtt',{}).get('#text'),
                'fg_pct': stats.get('FgPct',{}).get('#text'),
                'fg_made_1_to_19': stats.get('FgMade1_19',{}).get('#text'),
                'fg_att_1_to_19': stats.get('FgAtt1_19',{}).get('#text'),
                'fg_1_to_19_pct': stats.get('Fg1_19Pct',{}).get('#text'),
                'fg_made_20_to_29': stats.get('FgMade20_29',{}).get('#text'),
                'fg_att_20_to_29': stats.get('FgAtt20_29',{}).get('#text'),
                'fg_20_to_29_pct': stats.get('Fg20_29Pct',{}).get('#text'),
                'fg_made_30_to_39': stats.get('FgMade30_39',{}).get('#text'),
                'fg_att_30_to_39': stats.get('FgAtt30_39',{}).get('#text'),
                'fg_30_to_39_pct': stats.get('Fg30_39Pct',{}).get('#text'),
                'fg_made_40_to_49': stats.get('FgMade40_49',{}).get('#text'),
                'fg_att_40_to_49': stats.get('FgAtt40_49',{}).get('#text'),
                'fg_40_to_49_pct': stats.get('Fg40_49Pct',{}).get('#text'),
                'fg_made_50_plus': stats.get('FgMade50Plus',{}).get('#text'),
                'fg_att_50_plus': stats.get('FgAtt50Plus',{}).get('#text'),
                'fg_50_plus_pct': stats.get('Fg50PlusPct',{}).get('#text'),
                'fg_lng': stats.get('FgLng',{}).get('#text'),
                'xp_blk': stats.get('XpBlk',{}).get('#text'),
                'xp_made': stats.get('XpMade',{}).get('#text'),
                'xp_att': stats.get('XpAtt',{}).get('#text'),
                'xp_pct': stats.get('XpPct',{}).get('#text'),
                'fg_and_xp_pts': stats.get('FgAndXpPts',{}).get('#text'),
                'ko': stats.get('Kickoffs',{}).get('#text'),
                'ko_yds': stats.get('KoYds',{}).get('#text'),
                'ko_oob': stats.get('KoOOB',{}).get('#text'),
                'ko_avg': stats.get('KoAvg',{}).get('#text'),
                'ko_tb': stats.get('KoTB',{}).get('#text'),
                'ko_pct': stats.get('KoPct',{}).get('#text'),
                'ko_ret': stats.get('KoRet',{}).get('#text'),
                'ko_ret_yds': stats.get('KoRetYds',{}).get('#text'),
                'ko_ret_avg_yds': stats.get('KoRetAvgYds',{}).get('#text'),
                'ko_td': stats.get('KoTD',{}).get('#text'),
                'ko_os': stats.get('KoOS',{}).get('#text'),
                'ko_osr': stats.get('KoOSR',{}).get('#text'),
                'punts': stats.get('Punts',{}).get('#text'),
                'punt_yds': stats.get('PuntYds',{}).get('#text'),
                'punt_net_yds': stats.get('PuntNetYds',{}).get('#text'),
                'punt_lng': stats.get('PuntLng',{}).get('#text'),
                'punt_avg': stats.get('PuntAvg',{}).get('#text'),
                'punt_net_avg': stats.get('PuntNetAvg',{}).get('#text'),
                'punt_blk': stats.get('PuntBlk',{}).get('#text'),
                'punt_oob': stats.get('PuntOOB',{}).get('#text'),
                'punt_down': stats.get('PuntDown',{}).get('#text'),
                'punt_in_20': stats.get('PuntIn20',{}).get('#text'),
                'punt_in_20_pct': stats.get('PuntIn20Pct',{}).get('#text'),
                'punt_tb': stats.get('PuntTB',{}).get('#text'),
                'punt_tb_pct': stats.get('PuntTBPct',{}).get('#text'),
                'punt_fc': stats.get('PuntFC',{}).get('#text'),
                'punt_ret': stats.get('PuntRet',{}).get('#text'),
                'punt_ret_yds': stats.get('PuntRetYds',{}).get('#text'),
                'punt_ret_avg': stats.get('PuntRetAvg',{}).get('#text')
            })


        for player_entry in home_player_entries:
            player = player_entry['player']
            stats = player_entry.get('stats',{})
            # Sometimes stats can be null
            if stats is None:
                stats = {}

            player_stats.append({
                'msf_player_id': player['ID'],
                'msf_game_id': payload['gameid'],
                'msf_team_id': home_team_id,
                'pass_att': stats.get('PassAttempts',{}).get('#text'),
                'pass_comp': stats.get('PassCompletions',{}).get('#text'),
                'pass_pct': stats.get('PassPct',{}).get('#text'),
                'pass_yds': stats.get('PassYards',{}).get('#text'),
                'pass_avg': stats.get('PassAvg',{}).get('#text'),
                'pass_yds_per_att': stats.get('PassYardsPerAtt',{}).get('#text'),
                'pass_td': stats.get('PassTD',{}).get('#text'),
                'pass_td_pct': stats.get('PassTDPct',{}).get('#text'),
                'pass_int': stats.get('PassInt',{}).get('#text'),
                'pass_int_pct': stats.get('PassIntPct',{}).get('#text'),
                'pass_lng': stats.get('PassLng',{}).get('#text'),
                'pass_20_plus': stats.get('Pass20Plus',{}).get('#text'),
                'pass_40_plus': stats.get('Pass40Plus',{}).get('#text'),
                'pass_sacks': stats.get('PassSacks',{}).get('#text'),
                'pass_sack_y': stats.get('PassSackY',{}).get('#text'),
                'qb_rating': stats.get('QBRating',{}).get('#text'),
                'rush_att': stats.get('RushAttempts',{}).get('#text'),
                'rush_yds': stats.get('RushYards',{}).get('#text'),
                'rush_avg': stats.get('RushAverage',{}).get('#text'),
                'rush_td': stats.get('RushTD',{}).get('#text'),
                'rush_lng': stats.get('RushLng',{}).get('#text'),
                'rush_20_plus': stats.get('Rush20Plus',{}).get('#text'),
                'rush_40_plus': stats.get('Rush40Plus',{}).get('#text'),
                'rush_fum': stats.get('RushFumbles',{}).get('#text'),
                'rec_tgt': stats.get('Targets',{}).get('#text'),
                'rec_rec': stats.get('Receptions',{}).get('#text'),
                'rec_yds': stats.get('RecYards',{}).get('#text'),
                'rec_avg': stats.get('RecAverage',{}).get('#text'),
                'rec_td': stats.get('RecTD',{}).get('#text'),
                'rec_lng': stats.get('RecLng',{}).get('#text'),
                'rec_20_plus': stats.get('Rec20Plus',{}).get('#text'),
                'rec_40_plus': stats.get('Rec40Plus',{}).get('#text'),
                'rec_fum': stats.get('RecFumbles',{}).get('#text'),
                'tackle_solo': stats.get('TackleSolo',{}).get('#text'),
                'tackle_total': stats.get('TackleTotal',{}).get('#text'),
                'tackle_ast': stats.get('TackleAst',{}).get('#text'),
                'sacks': stats.get('Sacks',{}).get('#text'),
                'sack_yds': stats.get('SackYds',{}).get('#text'),
                'sfty': stats.get('Safeties',{}).get('#text'),
                'tackles_for_loss': stats.get('TacklesForLoss',{}).get('#text'),
                'interceptions': stats.get('Interceptions',{}).get('#text'),
                'int_td': stats.get('IntTD',{}).get('#text'),
                'int_yds': stats.get('IntYds',{}).get('#text'),
                'int_avg': stats.get('IntAverage',{}).get('#text'),
                'int_lng': stats.get('IntLng',{}).get('#text'),
                'passes_defended': stats.get('PassesDefended',{}).get('#text'),
                'stuffs': stats.get('Stuffs',{}).get('#text'),
                'stuff_yds': stats.get('StuffYds',{}).get('#text'),
                'kb': stats.get('KB',{}).get('#text'),
                'fum': stats.get('Fumbles',{}).get('#text'),
                'fum_lost': stats.get('FumLost',{}).get('#text'),
                'fum_forced': stats.get('FumForced',{}).get('#text'),
                'fum_own_rec': stats.get('FumOwnRec',{}).get('#text'),
                'fum_opp_rec': stats.get('FumOppRec',{}).get('#text'),
                'fum_rec_yds': stats.get('FumRecYds',{}).get('#text'),
                'fum_total_rec': stats.get('FumTotalRec',{}).get('#text'),
                'fum_td': stats.get('FumTD',{}).get('#text'),
                'kr_ret': stats.get('KrRet',{}).get('#text'),
                'kr_yds': stats.get('KrYds',{}).get('#text'),
                'kr_avg': stats.get('KrAvg',{}).get('#text'),
                'kr_lng': stats.get('KrLng',{}).get('#text'),
                'kr_td': stats.get('KrTD',{}).get('#text'),
                'kr_20_plus': stats.get('Kr20Plus',{}).get('#text'),
                'kr_40_plus': stats.get('Kr40Plus',{}).get('#text'),
                'kr_fc': stats.get('KrFC',{}).get('#text'),
                'kr_fum': stats.get('KrFum',{}).get('#text'),
                'pr_ret': stats.get('PrRet',{}).get('#text'),
                'pr_yds': stats.get('PrYds',{}).get('#text'),
                'pr_avg': stats.get('PrAvg',{}).get('#text'),
                'pr_lng': stats.get('PrLng',{}).get('#text'),
                'pr_td': stats.get('PrTD',{}).get('#text'),
                'pr_20_plus': stats.get('Pr20Plus',{}).get('#text'),
                'pr_40_plus': stats.get('Pr40Plus',{}).get('#text'),
                'pr_fc': stats.get('PrFC',{}).get('#text'),
                'pr_fum': stats.get('PrFum',{}).get('#text'),
                'two_pt_att': stats.get('TwoPtAtt',{}).get('#text'),
                'two_pt_made': stats.get('TwoPtMade',{}).get('#text'),
                'two_pt_pass_att': stats.get('TwoPtPassAtt',{}).get('#text'),
                'two_pt_pass_made': stats.get('TwoPtPassMade',{}).get('#text'),
                'two_pt_pass_rec': stats.get('TwoPtPassRec',{}).get('#text'),
                'two_pt_rush_att': stats.get('TwoPtRushAtt',{}).get('#text'),
                'two_pt_rush_made': stats.get('TwoPtRushMade',{}).get('#text'),
                'fg_blk': stats.get('FgBlk',{}).get('#text'),
                'fg_made': stats.get('FgMade',{}).get('#text'),
                'fg_att': stats.get('FgAtt',{}).get('#text'),
                'fg_pct': stats.get('FgPct',{}).get('#text'),
                'fg_made_1_to_19': stats.get('FgMade1_19',{}).get('#text'),
                'fg_att_1_to_19': stats.get('FgAtt1_19',{}).get('#text'),
                'fg_1_to_19_pct': stats.get('Fg1_19Pct',{}).get('#text'),
                'fg_made_20_to_29': stats.get('FgMade20_29',{}).get('#text'),
                'fg_att_20_to_29': stats.get('FgAtt20_29',{}).get('#text'),
                'fg_20_to_29_pct': stats.get('Fg20_29Pct',{}).get('#text'),
                'fg_made_30_to_39': stats.get('FgMade30_39',{}).get('#text'),
                'fg_att_30_to_39': stats.get('FgAtt30_39',{}).get('#text'),
                'fg_30_to_39_pct': stats.get('Fg30_39Pct',{}).get('#text'),
                'fg_made_40_to_49': stats.get('FgMade40_49',{}).get('#text'),
                'fg_att_40_to_49': stats.get('FgAtt40_49',{}).get('#text'),
                'fg_40_to_49_pct': stats.get('Fg40_49Pct',{}).get('#text'),
                'fg_made_50_plus': stats.get('FgMade50Plus',{}).get('#text'),
                'fg_att_50_plus': stats.get('FgAtt50Plus',{}).get('#text'),
                'fg_50_plus_pct': stats.get('Fg50PlusPct',{}).get('#text'),
                'fg_lng': stats.get('FgLng',{}).get('#text'),
                'xp_blk': stats.get('XpBlk',{}).get('#text'),
                'xp_made': stats.get('XpMade',{}).get('#text'),
                'xp_att': stats.get('XpAtt',{}).get('#text'),
                'xp_pct': stats.get('XpPct',{}).get('#text'),
                'fg_and_xp_pts': stats.get('FgAndXpPts',{}).get('#text'),
                'ko': stats.get('Kickoffs',{}).get('#text'),
                'ko_yds': stats.get('KoYds',{}).get('#text'),
                'ko_oob': stats.get('KoOOB',{}).get('#text'),
                'ko_avg': stats.get('KoAvg',{}).get('#text'),
                'ko_tb': stats.get('KoTB',{}).get('#text'),
                'ko_pct': stats.get('KoPct',{}).get('#text'),
                'ko_ret': stats.get('KoRet',{}).get('#text'),
                'ko_ret_yds': stats.get('KoRetYds',{}).get('#text'),
                'ko_ret_avg_yds': stats.get('KoRetAvgYds',{}).get('#text'),
                'ko_td': stats.get('KoTD',{}).get('#text'),
                'ko_os': stats.get('KoOS',{}).get('#text'),
                'ko_osr': stats.get('KoOSR',{}).get('#text'),
                'punts': stats.get('Punts',{}).get('#text'),
                'punt_yds': stats.get('PuntYds',{}).get('#text'),
                'punt_net_yds': stats.get('PuntNetYds',{}).get('#text'),
                'punt_lng': stats.get('PuntLng',{}).get('#text'),
                'punt_avg': stats.get('PuntAvg',{}).get('#text'),
                'punt_net_avg': stats.get('PuntNetAvg',{}).get('#text'),
                'punt_blk': stats.get('PuntBlk',{}).get('#text'),
                'punt_oob': stats.get('PuntOOB',{}).get('#text'),
                'punt_down': stats.get('PuntDown',{}).get('#text'),
                'punt_in_20': stats.get('PuntIn20',{}).get('#text'),
                'punt_in_20_pct': stats.get('PuntIn20Pct',{}).get('#text'),
                'punt_tb': stats.get('PuntTB',{}).get('#text'),
                'punt_tb_pct': stats.get('PuntTBPct',{}).get('#text'),
                'punt_fc': stats.get('PuntFC',{}).get('#text'),
                'punt_ret': stats.get('PuntRet',{}).get('#text'),
                'punt_ret_yds': stats.get('PuntRetYds',{}).get('#text'),
                'punt_ret_avg': stats.get('PuntRetAvg',{}).get('#text')
            })

        print("Saving player stats to DB")
        cur.executemany("""INSERT INTO msf_player_stats_boxscore(
                        msf_player_id,
                        msf_game_id,
                        msf_team_id,
                        pass_att,
                        pass_comp,
                        pass_pct,
                        pass_yds,
                        pass_avg,
                        pass_yds_per_att,
                        pass_td,
                        pass_td_pct,
                        pass_int,
                        pass_int_pct,
                        pass_lng,
                        "pass_20_plus",
                        "pass_40_plus",
                        pass_sacks,
                        pass_sack_y,
                        qb_rating,
                        rush_att,
                        rush_yds,
                        rush_avg,
                        rush_td,
                        rush_lng,
                        "rush_20_plus",
                        "rush_40_plus",
                        rush_fum,
                        rec_tgt,
                        rec_rec,
                        rec_yds,
                        rec_avg,
                        rec_td,
                        rec_lng,
                        "rec_20_plus",
                        "rec_40_plus",
                        rec_fum,
                        tackle_solo,
                        tackle_total,
                        tackle_ast,
                        sacks,
                        sack_yds,
                        sfty,
                        tackles_for_loss,
                        interceptions,
                        int_td,
                        int_yds,
                        int_avg,
                        int_lng,
                        passes_defended,
                        stuffs,
                        stuff_yds,
                        kb,
                        fum,
                        fum_lost,
                        fum_forced,
                        fum_own_rec,
                        fum_opp_rec,
                        fum_rec_yds,
                        fum_total_rec,
                        fum_td,
                        kr_ret,
                        kr_yds,
                        kr_avg,
                        kr_lng,
                        kr_td,
                        "kr_20_plus",
                        "kr_40_plus",
                        kr_fc,
                        kr_fum,
                        pr_ret,
                        pr_yds,
                        pr_avg,
                        pr_lng,
                        pr_td,
                        "pr_20_plus",
                        "pr_40_plus",
                        pr_fc,
                        pr_fum,
                        two_pt_att,
                        two_pt_made,
                        two_pt_pass_att,
                        two_pt_pass_made,
                        two_pt_pass_rec,
                        two_pt_rush_att,
                        two_pt_rush_made,
                        fg_blk,
                        fg_made,
                        fg_att,
                        fg_pct,
                        fg_made_1_to_19,
                        fg_att_1_to_19,
                        fg_1_to_19_pct,
                        fg_made_20_to_29,
                        fg_att_20_to_29,
                        fg_20_to_29_pct,
                        fg_made_30_to_39,
                        fg_att_30_to_39,
                        fg_30_to_39_pct,
                        fg_made_40_to_49,
                        fg_att_40_to_49,
                        fg_40_to_49_pct,
                        "fg_made_50_plus",
                        "fg_att_50_plus",
                        "fg_50_plus_pct",
                        fg_lng,
                        xp_blk,
                        xp_made,
                        xp_att,
                        xp_pct,
                        fg_and_xp_pts,
                        ko,
                        ko_yds,
                        ko_oob,
                        ko_avg,
                        ko_tb,
                        ko_pct,
                        ko_ret,
                        ko_ret_yds,
                        ko_ret_avg_yds,
                        ko_td,
                        ko_os,
                        ko_osr,
                        punts,
                        punt_yds,
                        punt_net_yds,
                        punt_lng,
                        punt_avg,
                        punt_net_avg,
                        punt_blk,
                        punt_oob,
                        punt_down,
                        punt_in_20,
                        punt_in_20_pct,
                        punt_tb,
                        punt_tb_pct,
                        punt_fc,
                        punt_ret,
                        punt_ret_yds,
                        punt_ret_avg
                    ) VALUES (
                    %(msf_player_id)s,
                    %(msf_game_id)s,
                    %(msf_team_id)s,
                    %(pass_att)s,
                    %(pass_comp)s,
                    %(pass_pct)s,
                    %(pass_yds)s,
                    %(pass_avg)s,
                    %(pass_yds_per_att)s,
                    %(pass_td)s,
                    %(pass_td_pct)s,
                    %(pass_int)s,
                    %(pass_int_pct)s,
                    %(pass_lng)s,
                    %(pass_20_plus)s,
                    %(pass_40_plus)s,
                    %(pass_sacks)s,
                    %(pass_sack_y)s,
                    %(qb_rating)s,
                    %(rush_att)s,
                    %(rush_yds)s,
                    %(rush_avg)s,
                    %(rush_td)s,
                    %(rush_lng)s,
                    %(rush_20_plus)s,
                    %(rush_40_plus)s,
                    %(rush_fum)s,
                    %(rec_tgt)s,
                    %(rec_rec)s,
                    %(rec_yds)s,
                    %(rec_avg)s,
                    %(rec_td)s,
                    %(rec_lng)s,
                    %(rec_20_plus)s,
                    %(rec_40_plus)s,
                    %(rec_fum)s,
                    %(tackle_solo)s,
                    %(tackle_total)s,
                    %(tackle_ast)s,
                    %(sacks)s,
                    %(sack_yds)s,
                    %(sfty)s,
                    %(tackles_for_loss)s,
                    %(interceptions)s,
                    %(int_td)s,
                    %(int_yds)s,
                    %(int_avg)s,
                    %(int_lng)s,
                    %(passes_defended)s,
                    %(stuffs)s,
                    %(stuff_yds)s,
                    %(kb)s,
                    %(fum)s,
                    %(fum_lost)s,
                    %(fum_forced)s,
                    %(fum_own_rec)s,
                    %(fum_opp_rec)s,
                    %(fum_rec_yds)s,
                    %(fum_total_rec)s,
                    %(fum_td)s,
                    %(kr_ret)s,
                    %(kr_yds)s,
                    %(kr_avg)s,
                    %(kr_lng)s,
                    %(kr_td)s,
                    %(kr_20_plus)s,
                    %(kr_40_plus)s,
                    %(kr_fc)s,
                    %(kr_fum)s,
                    %(pr_ret)s,
                    %(pr_yds)s,
                    %(pr_avg)s,
                    %(pr_lng)s,
                    %(pr_td)s,
                    %(pr_20_plus)s,
                    %(pr_40_plus)s,
                    %(pr_fc)s,
                    %(pr_fum)s,
                    %(two_pt_att)s,
                    %(two_pt_made)s,
                    %(two_pt_pass_att)s,
                    %(two_pt_pass_made)s,
                    %(two_pt_pass_rec)s,
                    %(two_pt_rush_att)s,
                    %(two_pt_rush_made)s,
                    %(fg_blk)s,
                    %(fg_made)s,
                    %(fg_att)s,
                    %(fg_pct)s,
                    %(fg_made_1_to_19)s,
                    %(fg_att_1_to_19)s,
                    %(fg_1_to_19_pct)s,
                    %(fg_made_20_to_29)s,
                    %(fg_att_20_to_29)s,
                    %(fg_20_to_29_pct)s,
                    %(fg_made_30_to_39)s,
                    %(fg_att_30_to_39)s,
                    %(fg_30_to_39_pct)s,
                    %(fg_made_40_to_49)s,
                    %(fg_att_40_to_49)s,
                    %(fg_40_to_49_pct)s,
                    %(fg_made_50_plus)s,
                    %(fg_att_50_plus)s,
                    %(fg_50_plus_pct)s,
                    %(fg_lng)s,
                    %(xp_blk)s,
                    %(xp_made)s,
                    %(xp_att)s,
                    %(xp_pct)s,
                    %(fg_and_xp_pts)s,
                    %(ko)s,
                    %(ko_yds)s,
                    %(ko_oob)s,
                    %(ko_avg)s,
                    %(ko_tb)s,
                    %(ko_pct)s,
                    %(ko_ret)s,
                    %(ko_ret_yds)s,
                    %(ko_ret_avg_yds)s,
                    %(ko_td)s,
                    %(ko_os)s,
                    %(ko_osr)s,
                    %(punts)s,
                    %(punt_yds)s,
                    %(punt_net_yds)s,
                    %(punt_lng)s,
                    %(punt_avg)s,
                    %(punt_net_avg)s,
                    %(punt_blk)s,
                    %(punt_oob)s,
                    %(punt_down)s,
                    %(punt_in_20)s,
                    %(punt_in_20_pct)s,
                    %(punt_tb)s,
                    %(punt_tb_pct)s,
                    %(punt_fc)s,
                    %(punt_ret)s,
                    %(punt_ret_yds)s,
                    %(punt_ret_avg)s
        
                )
                ON CONFLICT (msf_player_id,msf_game_id) DO UPDATE SET
                    msf_team_id = %(msf_team_id)s,
                    pass_att = %(pass_att)s,
                    pass_comp = %(pass_comp)s,
                    pass_pct = %(pass_pct)s,
                    pass_yds = %(pass_yds)s,
                    pass_avg = %(pass_avg)s,
                    pass_yds_per_att = %(pass_yds_per_att)s,
                    pass_td = %(pass_td)s,
                    pass_td_pct = %(pass_td_pct)s,
                    pass_int = %(pass_int)s,
                    pass_int_pct = %(pass_int_pct)s,
                    pass_lng = %(pass_lng)s,
                    "pass_20_plus" = %(pass_20_plus)s,
                    "pass_40_plus" = %(pass_40_plus)s,
                    pass_sacks = %(pass_sacks)s,
                    pass_sack_y = %(pass_sack_y)s,
                    qb_rating = %(qb_rating)s,
                    rush_att = %(rush_att)s,
                    rush_yds = %(rush_yds)s,
                    rush_avg = %(rush_avg)s,
                    rush_td = %(rush_td)s,
                    rush_lng = %(rush_lng)s,
                    "rush_20_plus" = %(rush_20_plus)s,
                    "rush_40_plus" = %(rush_40_plus)s,
                    rush_fum = %(rush_fum)s,
                    rec_tgt = %(rec_tgt)s,
                    rec_rec = %(rec_rec)s,
                    rec_yds = %(rec_yds)s,
                    rec_avg = %(rec_avg)s,
                    rec_td = %(rec_td)s,
                    rec_lng = %(rec_lng)s,
                    "rec_20_plus" = %(rec_20_plus)s,
                    "rec_40_plus" = %(rec_40_plus)s,
                    rec_fum = %(rec_fum)s,
                    tackle_solo = %(tackle_solo)s,
                    tackle_total = %(tackle_total)s,
                    tackle_ast = %(tackle_ast)s,
                    sacks = %(sacks)s,
                    sack_yds = %(sack_yds)s,
                    sfty = %(sfty)s,
                    tackles_for_loss = %(tackles_for_loss)s,
                    interceptions = %(interceptions)s,
                    int_td = %(int_td)s,
                    int_yds = %(int_yds)s,
                    int_avg = %(int_avg)s,
                    int_lng = %(int_lng)s,
                    passes_defended = %(passes_defended)s,
                    stuffs = %(stuffs)s,
                    stuff_yds = %(stuff_yds)s,
                    kb = %(kb)s,
                    fum = %(fum)s,
                    fum_lost = %(fum_lost)s,
                    fum_forced = %(fum_forced)s,
                    fum_own_rec = %(fum_own_rec)s,
                    fum_opp_rec = %(fum_opp_rec)s,
                    fum_rec_yds = %(fum_rec_yds)s,
                    fum_total_rec = %(fum_total_rec)s,
                    fum_td = %(fum_td)s,
                    kr_ret = %(kr_ret)s,
                    kr_yds = %(kr_yds)s,
                    kr_avg = %(kr_avg)s,
                    kr_lng = %(kr_lng)s,
                    kr_td = %(kr_td)s,
                    "kr_20_plus" = %(kr_20_plus)s,
                    "kr_40_plus" = %(kr_40_plus)s,
                    kr_fc = %(kr_fc)s,
                    kr_fum = %(kr_fum)s,
                    pr_ret = %(pr_ret)s,
                    pr_yds = %(pr_yds)s,
                    pr_avg = %(pr_avg)s,
                    pr_lng = %(pr_lng)s,
                    pr_td = %(pr_td)s,
                    "pr_20_plus" = %(pr_20_plus)s,
                    "pr_40_plus" = %(pr_40_plus)s,
                    pr_fc = %(pr_fc)s,
                    pr_fum = %(pr_fum)s,
                    two_pt_att = %(two_pt_att)s,
                    two_pt_made = %(two_pt_made)s,
                    two_pt_pass_att = %(two_pt_pass_att)s,
                    two_pt_pass_made = %(two_pt_pass_made)s,
                    two_pt_pass_rec = %(two_pt_pass_rec)s,
                    two_pt_rush_att = %(two_pt_rush_att)s,
                    two_pt_rush_made = %(two_pt_rush_made)s,
                    fg_blk = %(fg_blk)s,
                    fg_made = %(fg_made)s,
                    fg_att = %(fg_att)s,
                    fg_pct = %(fg_pct)s,
                    fg_made_1_to_19 = %(fg_made_1_to_19)s,
                    fg_att_1_to_19 = %(fg_att_1_to_19)s,
                    fg_1_to_19_pct = %(fg_1_to_19_pct)s,
                    fg_made_20_to_29 = %(fg_made_20_to_29)s,
                    fg_att_20_to_29 = %(fg_att_20_to_29)s,
                    fg_20_to_29_pct = %(fg_20_to_29_pct)s,
                    fg_made_30_to_39 = %(fg_made_30_to_39)s,
                    fg_att_30_to_39 = %(fg_att_30_to_39)s,
                    fg_30_to_39_pct = %(fg_30_to_39_pct)s,
                    fg_made_40_to_49 = %(fg_made_40_to_49)s,
                    fg_att_40_to_49 = %(fg_att_40_to_49)s,
                    fg_40_to_49_pct = %(fg_40_to_49_pct)s,
                    "fg_made_50_plus" = %(fg_made_50_plus)s,
                    "fg_att_50_plus" = %(fg_att_50_plus)s,
                    "fg_50_plus_pct" = %(fg_50_plus_pct)s,
                    fg_lng = %(fg_lng)s,
                    xp_blk = %(xp_blk)s,
                    xp_made = %(xp_made)s,
                    xp_att = %(xp_att)s,
                    xp_pct = %(xp_pct)s,
                    fg_and_xp_pts = %(fg_and_xp_pts)s,
                    ko = %(ko)s,
                    ko_yds = %(ko_yds)s,
                    ko_oob = %(ko_oob)s,
                    ko_avg = %(ko_avg)s,
                    ko_tb = %(ko_tb)s,
                    ko_pct = %(ko_pct)s,
                    ko_ret = %(ko_ret)s,
                    ko_ret_yds = %(ko_ret_yds)s,
                    ko_ret_avg_yds = %(ko_ret_avg_yds)s,
                    ko_td = %(ko_td)s,
                    ko_os = %(ko_os)s,
                    ko_osr = %(ko_osr)s,
                    punts = %(punts)s,
                    punt_yds = %(punt_yds)s,
                    punt_net_yds = %(punt_net_yds)s,
                    punt_lng = %(punt_lng)s,
                    punt_avg = %(punt_avg)s,
                    punt_net_avg = %(punt_net_avg)s,
                    punt_blk = %(punt_blk)s,
                    punt_oob = %(punt_oob)s,
                    punt_down = %(punt_down)s,
                    punt_in_20 = %(punt_in_20)s,
                    punt_in_20_pct = %(punt_in_20_pct)s,
                    punt_tb = %(punt_tb)s,
                    punt_tb_pct = %(punt_tb_pct)s,
                    punt_fc = %(punt_fc)s,
                    punt_ret = %(punt_ret)s,
                    punt_ret_yds = %(punt_ret_yds)s,
                    punt_ret_avg = %(punt_ret_avg)s
                """, player_stats)

    else:
        print("Reponse code not ok - failure")


connect_to_db()
