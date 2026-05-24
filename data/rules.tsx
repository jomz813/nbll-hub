
import React from 'react';

export const rulesData = [
  {
    id: 'integrity',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Competitive Integrity',
    content: [
      'Commissioners reserve the right to intervene for exploits or behaviors not explicitly covered.',
      'Emergency rulings may be issued to protect fairness, including stat corrections or suspensions.',
      'All commissioner actions must be publicly documented.',
      'Admin abuse (e.g., affecting player stats, griefing) results in an immediate forfeit loss (FFL) and investigation.'
    ]
  },
  {
    id: 'gameplay',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    ),
    title: 'Gameplay Rules',
    content: [
      '8v8 gameplay only (7v7 allowed if both teams agree, 8v7 allowed if forced). 6v8 or 6v7 is never allowed.',
      'Games must start within 20 minutes of the scheduled time or result in an FFL.',
      'Mercy rule must be turned on. Teams may have a maximum of 12 players.',
      'Only 1 Offensive Lineman (OL) is allowed on the field and may line up inside the hash.',
      'Tight Ends (TE) must line up outside the hash, except inside your own 10-yard line.',
      'TEs may only block up to 5 yards.',
      'Mandatory PC check at the beginning of the game. Each team gets a maximum of 3 PCs after that.',
      'Flags may only be challenged by a referee.',
      '4th & 25 may be called maximum 2 times during the last 3 minutes of the 4th quarter.',
      '2-point attempts are NOT allowed until the 4th quarter.'
    ]
  },
  {
    id: 'flags',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
      </svg>
    ),
    title: 'Flag Information',
    content: [
      {
        text: 'Illegal Formation (IF): 10 yards + replay of down.',
        subRules: [
          'More than one OL on the field.',
          'TE or WR lined up inside the hash.',
          'TE blocking for more than 5 yards.'
        ]
      },
      {
        text: 'Illegal Route (IR): 5 yards + loss of down.',
        subRules: [
          'A receiver goes out of bounds during their route.'
        ]
      },
      {
        text: 'Ground Rule (GR): Loss of down + ball returned to spot of throw.',
        subRules: [
          'QB throws the ball away where no receiver or CB can make a play.'
        ]
      },
      {
        text: 'Milking (MK): Immediate turnover.',
        subRules: [
          'Intentional wasting of clock on offense. Milking is NEVER allowed at any point in the game.'
        ]
      }
    ]
  },
  {
    id: 'one-game',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    title: '1GS (One Game Series) Rules',
    content: [
      'Players using 1GS receive exactly 50% of recorded stats.',
      'Teams are allowed a maximum of 2 standard 1Gs per regular season.',
      'A player may play a maximum of 2 games per series. Playing a 3rd results in a suspension.',
      '1GS is strictly prohibited in the playoffs.',
      'A ticket is REQUIRED for 1GS. Playing without a ticket voids all touchdowns and interceptions.'
    ]
  },
  {
    id: 'scheduling',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Scheduling Rules',
    content: [
      'Teams have 4–5 days maximum to schedule a game.',
      'Both teams must agree on a confirmed time (in EST).',
      'Once a time is confirmed in the GameTimes channel, it cannot be changed unless both teams agree.',
      'Going up 3–0 allows a team to force a reasonable time (7 PM - 11 PM EST).',
      'Only Franchise Owners, GMs, and Head Coaches may schedule games.'
    ]
  },
  {
    id: 'stats-refs',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    title: 'Stats & Referees',
    content: [
      'Letting a team purposely score to avoid the mercy rule results in a 50% stats cut.',
      'Leaving before stats are recorded results in warnings, and eventually nullified stats.',
      'Lying about playing position (OL/TE) leads to stat deductions and suspensions.',
      'Referees cannot be rostered on either team and must be approved before kickoff.',
      'Referees who miss obvious calls, show bias, or lack rule knowledge may be removed from the position.'
    ]
  },
  {
    id: 'suspensions',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    title: 'Suspensions & Fines',
    content: [
      'Unapproved disbanding and improper transfers result in heavy fines and suspensions.',
      'Possession or distribution of cheats results in massive Robux fines and suspensions up to a permanent ban.',
      'Cheating in-game brings an immediate suspension and heavy fine.',
      'Double Counter Verification is mandatory when staff executes a /force check.',
      'Failure to verify upon request leads to immediate removal and potential suspension.'
    ]
  }
];
