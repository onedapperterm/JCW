import { useState } from 'react';
import './SkillGrid.css';

const SKILLS: string[] = [
  'Java',
  'TypeScript',
  'JavaScript',
  'Python',
  'Django',
  'Flask',
  'FastAPI',
  'Nodejs',
  'Next',
  'Nuxt',
  'Vuejs',
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  'Shell',
  'Bash',
  'Git',
  'Docker',
  'AWS',
  'HTML',
  'CSS',
  'SASS',
  'TailwindCSS',
  'Bootstrap',
  'MaterialDesign',
  'Jasmine',
  'Karma',
  'Jest',
  'Cypress',
  'JUnit',
  'Mockito',
  'Hibernate',
  'REST',
  'Jira',
  'Confluence',
  'Bitbucket',
  'GitLab',
  'Liquibase',
  'Maven',
  'Gradle',
  'Ionic',
  'Capacitor',
  'SSR',
]

export interface WordCell {
  chars: string[];
  wordIndex: number;
  size: number;
  delay: number;
  empty?: boolean;
}

const SkillsGrid = () => {

  const rows = 10;
  const columns = Math.ceil(SKILLS.reduce((acc, skill) => acc + skill.length, 0) / rows);

  const filledRows: string[][] = [];
  let remainingWords = [...SKILLS].sort((a, b) => b.length - a.length);

  while (remainingWords.length > 0) {
    let currentLine: string[] = [];
    let currentLength = 0;
    let i = 0;

    while (i < remainingWords.length) {
      if (currentLength + remainingWords[i].length <= columns) {
        currentLine.push(remainingWords[i]);
        currentLine.push(' ');
        currentLength += remainingWords[i].length + 1;
        remainingWords.splice(i, 1);
      } else {
        i++;
      }
    }

    if (currentLine.length === 0 && remainingWords.length > 0) {
      currentLine.push(remainingWords[0]);
      remainingWords.splice(0, 1);
    }

    currentLine = currentLine.slice(0, currentLine.length - 1);
    const lineCharAmount = currentLine.reduce((acc, str) => acc + str.length, 0);

    if(lineCharAmount < columns) {
      const delta = columns - lineCharAmount;
      if(currentLine.length === 1) {
        currentLine.push(' '.repeat(delta));
      } else {
        const blankSpaces = currentLine.filter(str => str === ' ').length;
        const spacesToAdd = Math.floor(delta / blankSpaces);
        const remainder = delta % blankSpaces;
        currentLine = currentLine.map((str, index) => {
          if (str === ' ') {
            const space = str + ' '.repeat(spacesToAdd);
            return index == 1 && remainder > 0 ? space + ' '.repeat(remainder) : space;
          } else {
            return str;
          }
        })
      }
    }

    filledRows.push(currentLine);
  }

  const [ hovered, setHovered ] = useState<number | null>(null);

  const handleMouseEnter = (cell: WordCell) => {
    const index = cell.empty ? null : cell.wordIndex;
    setHovered(index);
  }

  const handleMouseLeave = () => {
    setHovered(null);
  }


  let wordCount = 0;
  const words: WordCell[][] = filledRows.map(line => {
    return line.map(word => {
      wordCount++;
      return {
        chars: word.split(''),
        wordIndex: wordCount,
        size: word.length,
        delay: wordCount * 0.1,
        empty: word.trim() === '',
      }
    });
  });

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
  }

  return (
    <>
    <div className="flex items-center justify-center pb-16">
      <div style={containerStyle} className="w-[80vw]">
        {words.map(line => {
          let offset = 0;
          return line.map(wordCell => {
            offset = offset + wordCell.size 
            return (
              <div 
                key={wordCell.wordIndex} 
                onMouseEnter={() => handleMouseEnter(wordCell)}
                onMouseLeave={handleMouseLeave}
                style={{ 
                  animationDelay: wordCell.delay + 's',
                  gridColumn: `${1 + offset - wordCell.size} / span ${wordCell.size}`,
                  gridTemplateColumns: `repeat(${wordCell.size}, 1fr)`
                }} 
                className={`uppercase text-2xl h-12 grid ${hovered !== null && hovered !== wordCell.wordIndex ? 'idle' : ''} ${wordCell.empty ? '' : 'word-cell'}`}
              >
                    {wordCell.chars.map((char, i)=> (<div key={i} className="flex items-center justify-center">{char}</div>))}
              </div>
            )
          })
        })}
      </div>
    </div>
    </>
  );
};

export default SkillsGrid;

