"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { fleetGroups } from "@/data/fleet";

interface FleetCardsProps {
  compact?: boolean;
}

export function FleetCards({ compact = false }: FleetCardsProps) {
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [activeIndexes, setActiveIndexes] = useState<Record<string, number>>({});

  const moveGroup = (groupTitle: string, total: number, direction: 1 | -1) => {
    setActiveIndexes((current) => {
      const currentIndex = current[groupTitle] ?? 0;
      return {
        ...current,
        [groupTitle]: (currentIndex + direction + total) % total,
      };
    });
  };

  if (compact) {
    const activeGroup = fleetGroups[activeGroupIndex];
    const activeVesselIndex = activeIndexes[activeGroup.title] ?? 0;
    const activeVessel = activeGroup.vessels[activeVesselIndex];
    const visibleVessels = activeGroup.vessels;
    const ActiveIcon = activeVessel.icon;

    return (
      <div className="fleet-showcase">
        <div className="fleet-showcase-panel">
          <div className="fleet-showcase-meta">
            <div className="fleet-showcase-stats" aria-label="Tổng quan đội tàu">
              <div>
                <strong>04</strong>
                <span>Tàu biển</span>
              </div>
              <div>
                <strong>08</strong>
                <span>Tàu sông</span>
              </div>
              <div>
                <strong>24K</strong>
                <span>DWT tối đa</span>
              </div>
            </div>
            <div className="fleet-showcase-tabs" role="tablist" aria-label="Nhóm đội tàu">
              {fleetGroups.map((group, index) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeGroupIndex === index}
                  key={group.title}
                  onClick={() => setActiveGroupIndex(index)}
                >
                  {group.title}
                </button>
              ))}
            </div>
          </div>

          <div className="fleet-showcase-heading">
            <div>
              <h3>{activeGroup.title}</h3>
              <p>{activeGroup.summary}</p>
            </div>
            <div className="fleet-card-controls" aria-label={`Điều hướng ${activeGroup.title}`}>
              <button type="button" onClick={() => moveGroup(activeGroup.title, activeGroup.vessels.length, -1)}>
                <ArrowLeft aria-hidden="true" />
                <span className="sr-only">Tàu trước</span>
              </button>
              <button type="button" onClick={() => moveGroup(activeGroup.title, activeGroup.vessels.length, 1)}>
                <ArrowRight aria-hidden="true" />
                <span className="sr-only">Tàu tiếp theo</span>
              </button>
            </div>
          </div>

          <div className="fleet-feature-layout">
            <article className="fleet-feature-card">
              <div className="fleet-feature-image">
                <Image
                  src={activeVessel.image}
                  alt={`${activeVessel.name} - ${activeVessel.type}`}
                  fill
                  sizes="(max-width: 940px) 100vw, 58vw"
                />
                <span className="fleet-feature-badge">
                  <ActiveIcon aria-hidden="true" />
                  {activeVessel.type}
                </span>
              </div>
              <div className="fleet-feature-copy">
                <div>
                  <span>Đang hiển thị</span>
                  <h4>{activeVessel.name}</h4>
                </div>
                <dl>
                  <div>
                    <dt>Trọng tải</dt>
                    <dd>{activeVessel.capacity}</dd>
                  </div>
                  <div>
                    <dt>Tuyến</dt>
                    <dd>{activeVessel.route}</dd>
                  </div>
                </dl>
              </div>
            </article>

            <div className="fleet-feature-list" aria-label="Danh sách tàu trong nhóm">
              {visibleVessels.map((vessel) => {
              const Icon = vessel.icon;
              return (
                <button
                  type="button"
                  className="fleet-feature-list-item"
                  aria-current={vessel.name === activeVessel.name}
                  key={vessel.name}
                  onClick={() => {
                    const nextIndex = activeGroup.vessels.findIndex((item) => item.name === vessel.name);
                    setActiveIndexes((current) => ({ ...current, [activeGroup.title]: nextIndex }));
                  }}
                >
                  <span className="fleet-feature-list-icon">
                      <Icon aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{vessel.name}</strong>
                    <small>{vessel.capacity} · {vessel.route}</small>
                  </span>
                  <ArrowUpRight aria-hidden="true" />
                </button>
              );
            })}
            </div>
          </div>

          <a className="fleet-overview-link" href="/fleet">
            Xem toàn bộ đội tàu
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="fleet-directory">
      <div className="fleet-directory-summary" aria-label="Tổng quan đội tàu">
        <div>
          <span>Tổng phương tiện</span>
          <strong>12</strong>
        </div>
        <div>
          <span>Tàu biển</span>
          <strong>04</strong>
        </div>
        <div>
          <span>Tàu sông</span>
          <strong>08</strong>
        </div>
        <div>
          <span>Tuyến khai thác</span>
          <strong>Nội địa / Quốc tế</strong>
        </div>
      </div>
      {fleetGroups.map((group) => (
        <section className="fleet-card-group" key={group.title} aria-labelledby={`fleet-${group.title}`}>
          <div className="fleet-card-group-heading">
            <div>
              <h3 id={`fleet-${group.title}`}>{group.title}</h3>
              <p>{group.summary}</p>
            </div>
          </div>
          <div className="fleet-card-grid">
            {group.vessels.map((vessel) => {
              const Icon = vessel.icon;
              return (
                <article className="fleet-card" key={vessel.name}>
                  <div className="fleet-directory-card-head">
                    <span className="fleet-card-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <div>
                      <h4>{vessel.name}</h4>
                      <p>{vessel.type}</p>
                    </div>
                  </div>
                  <div className="fleet-card-image">
                    <Image src={vessel.image} alt={`${vessel.name} - ${vessel.type}`} fill sizes="(max-width: 680px) 100vw, (max-width: 1180px) 50vw, 25vw" />
                  </div>
                  <div className="fleet-card-copy">
                    <dl>
                      <div>
                        <dt>Trọng tải</dt>
                        <dd>{vessel.capacity}</dd>
                      </div>
                      <div>
                        <dt>Tuyến</dt>
                        <dd>{vessel.route}</dd>
                      </div>
                    </dl>
                    <a href="/fleet" className="fleet-card-link">
                      Xem chi tiết
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
