const AnimatedLogo = () => {
  return (
    <div className="container">
      <svg xmlns="http://www.w3.org/2000/svg" height="200" width="200">
        <g style={{ order: -1 }}>
          <polygon
            transform="rotate(45 100 100)"
            strokeWidth="1"
            stroke="#34d399"
            fill="none"
            points="70,70 148,50 130,130 50,150"
            id="bounce"
          />

          <polygon
            transform="rotate(45 100 100)"
            strokeWidth="1"
            stroke="#34d399"
            fill="none"
            points="70,70 148,50 130,130 50,150"
            id="bounce2"
          />

          <polygon
            transform="rotate(45 100 100)"
            strokeWidth="2"
            fill="#064e3b"
            points="70,70 150,50 130,130 50,150"
          />

          <polygon
            strokeWidth="2"
            fill="url(#gradiente)"
            points="100,70 150,100 100,130 50,100"
          />

          <defs>
            <linearGradient y2="100%" x2="10%" y1="0%" x1="0%" id="gradiente">
              <stop
                style={{ stopColor: "#0b0f0d", stopOpacity: 1 }}
                offset="20%"
              />
              <stop
                style={{ stopColor: "#064e3b", stopOpacity: 1 }}
                offset="60%"
              />
            </linearGradient>
          </defs>

          <polygon
            transform="translate(20, 31)"
            strokeWidth="2"
            fill="#10b981"
            points="80,50 80,75 80,99 40,75"
          />

          <polygon
            transform="translate(20, 31)"
            strokeWidth="2"
            fill="url(#gradiente2)"
            points="40,-40 80,-40 80,99 40,75"
          />

          <defs>
            <linearGradient
              y2="100%"
              x2="0%"
              y1="-17%"
              x1="10%"
              id="gradiente2"
            >
              <stop
                style={{ stopColor: "#34d39900", stopOpacity: 1 }}
                offset="20%"
              />
              <stop
                className="animated-stop"
                style={{
                  stopColor: "#34d39954",
                  stopOpacity: 1,
                }}
                offset="100%"
              />
            </linearGradient>
          </defs>

          <polygon
            transform="rotate(180 100 100) translate(20, 20)"
            strokeWidth="2"
            fill="#34d399"
            points="80,50 80,75 80,99 40,75"
          />

          <polygon
            transform="rotate(0 100 100) translate(60, 20)"
            strokeWidth="2"
            fill="url(#gradiente3)"
            points="40,-40 80,-40 80,85 40,110.2"
          />

          <defs>
            <linearGradient y2="100%" x2="10%" y1="0%" x1="0%" id="gradiente3">
              <stop
                style={{ stopColor: "#34d39900", stopOpacity: 1 }}
                offset="20%"
              />
              <stop
                className="animated-stop"
                style={{
                  stopColor: "#34d39954",
                  stopOpacity: 1,
                }}
                offset="100%"
              />
            </linearGradient>
          </defs>

          <polygon
            className="particles"
            transform="rotate(45 100 100) translate(80, 95)"
            strokeWidth="2"
            fill="#6ee7b7"
            points="5,0 5,5 0,5 0,0"
          />

          <polygon
            className="particles"
            transform="rotate(45 100 100) translate(80, 55)"
            strokeWidth="2"
            fill="#059669"
            points="6,0 6,6 0,6 0,0"
          />

          <polygon
            className="particles"
            transform="rotate(45 100 100) translate(70, 80)"
            strokeWidth="2"
            fill="#fff"
            points="2,0 2,2 0,2 0,0"
          />

          <polygon
            strokeWidth="2"
            fill="#0d1612"
            points="29.5,99.8 100,142 100,172 29.5,130"
          />

          <polygon
            transform="translate(50, 92)"
            strokeWidth="2"
            fill="#090c0a"
            points="50,50 120.5,8 120.5,35 50,80"
          />

          <image
            href="/AuthIcon.svg"
            x="75"
            y="40"
            height="50"
            width="50"
            className="auth-icon"
          />
        </g>
      </svg>
      <style>{`.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes bounce {
  0%,
  100% {
    translate: 0px 36px;
  }

  50% {
    translate: 0px 46px;
  }
}

@keyframes bounce2 {
  0%,
  100% {
    translate: 0px 46px;
  }

  50% {
    translate: 0px 56px;
  }
}

@keyframes umbral {
  0% {
    stop-color: #34d3992e;
  }

  50% {
    stop-color: rgba(52, 211, 153, 0.519);
  }

  100% {
    stop-color: #34d3992e;
  }
}

@keyframes particles {
  0%,
  100% {
    translate: 0px 16px;
  }

  50% {
    translate: 0px 6px;
  }
}

.particles {
  animation: particles 4s ease-in-out infinite;
}

.animated-stop {
  animation: umbral 4s infinite;
}

#bounce {
  animation: bounce 4s ease-in-out infinite;
  translate: 0px 36px;
}

#bounce2 {
  animation: bounce2 4s ease-in-out infinite;
  translate: 0px 46px;
  animation-delay: 0.5s;
}

.auth-icon {
  transition: transform 0.3s ease;
}

.container:hover .auth-icon,
.auth-icon:hover {
  transform: translateY(-10px);
}`}</style>
    </div>
  );
};

export default AnimatedLogo;