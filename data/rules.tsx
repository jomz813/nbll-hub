
import React from 'react';

export const rulesData = [
  {
    id: 'server',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6" y2="6"/><line x1="6" y1="18" x2="6" y2="18"/>
      </svg>
    ),
    title: 'Server Rules',
    content: [
      'No NSFW content',
      'No advertising or promoting',
      'No spamming',
      'User information must remain confidential',
      'Follow the Discord Community Guidelines'
    ]
  },
  {
    id: 'franchise',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/>
      </svg>
    ),
    title: 'Franchise Rules',
    content: [
      'You may only play on 1 team per schedule release',
      'No loans',
      'Leaving the server to bypass the demand cooldown will result in a suspension'
    ]
  },
  {
    id: 'setup',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
    title: 'Setup Rules',
    content: [
      '4v4 only',
      'Mercy must always be on',
      'All games must be played on North American servers',
      'You must take the ball out of bounds to start the game',
      'A team has 15 minutes to join after the code is sent',
      'Excessive ball skins, effects, or emotes are not allowed (FOV-changing or large visual effects)',
      'You may not waste time by calling unnecessary timeouts'
    ]
  },
  {
    id: 'court',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
      </svg>
    ),
    title: 'Cherry Picking & Court Rules',
    content: [
      {
        text: 'No cherry picking or inbounding to the opposite half unless:',
        subRules: ['The ball went out of bounds', 'Off a rebound', 'A new quarter has begun']
      },
      'Cherry picking is allowed with under 10 seconds left in any quarter'
    ]
  },
  {
    id: 'timeout',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Timeout Rules',
    content: [
      'Each team is allowed 3 timeouts',
      'Each timeout lasts 3 minutes',
      'Going over 3 minutes causes timeouts to stack',
      'After a timeout, the ball must be cleared backcourt on the inbound'
    ]
  },
  {
    id: 'pccheck',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    title: 'PC Checking Rules',
    content: [
      'PC checks may be requested during a game with a clip showing suspicious behavior',
      'You do not need a clip to check for alting',
      'PC checks cannot be called in the 4th quarter unless the clip is obvious',
      'PC checks must be conducted by an official PC checker',
      'Leaving after being asked for a PC check results in an FFL',
      'Recently clearing shellbags results in an FFL'
    ]
  },
  {
    id: 'suspension',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    title: 'Suspension-Level Offenses',
    content: [
      'Advertising or sending cheats',
      'Reporting an account to Infinity Sports for ban evasion',
      'Using macros, cheats, FPS uncapping, bootstrappers, or fastflags',
      'Gifting boxes to a player in action'
    ]
  },
  {
    id: 'ban',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
      </svg>
    ),
    title: 'Ban-Level Offenses',
    content: [
      'DDoSing or intentionally interrupting a game',
      'Repeated offenses'
    ]
  }
];
